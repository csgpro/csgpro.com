// angular
import { Injectable } from '@angular/core';
import { Router }     from '@angular/router';

// libs
import { tokenNotExpired } from 'angular2-jwt';

// app
import { ApiService }   from './api.service';
import { StoreService } from './store.service';

@Injectable()
export class AuthenticationService {

    constructor(private _api: ApiService, private _store: StoreService, private _router: Router) {
        if (this.isAuthenticated()) {
            this._setAuthToken(this._store.getString('authtoken'));
        }
    }

    login(credentials: { email: string; password: string }) {
        return this._api.post('authenticate', credentials).then((res: any) => {
            let response = res.json();
            this._setAuthToken(response.token);
            this._router.navigate(['/dashboard']);
        });
    }

    logout() {
        this._setAuthToken();
        this._router.navigate(['/login']);
    }

    requestPasswordReset(email: string) {
        return this._api.post('user/resetpassword', { email });
    }

    resetPassword(password: string, token: string) {
        return this._api.post('user/resetpassword', { password, token });
    }

    isAuthenticated() {
        return tokenNotExpired('authtoken');
    }

    private _setAuthToken(token?: string) {
        if (token) {
            this._store.setString('authtoken', token);
        } else {
            this._store.clearString('authtoken');
        }
        this._api.headers.set('Authorization', 'Bearer ' + token);
    }
}
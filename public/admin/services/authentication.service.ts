// angular
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

// app
import {ApiService} from './api.service';
import {StoreService} from './store.service';

@Injectable()
export class AuthenticationService {

    isLoggedIn = false;
    ready = false;

    constructor(private _api: ApiService, private _store: StoreService, private _router: Router) {
        const token = this._store.getString('authtoken');
        if (token) {
            this._setToken(token);
            this._renewToken().then((token) => {
                this.isLoggedIn = true;
                this._setToken(token);
                this.ready = true;
            }).catch(err => {
                if (err.status === 401) {
                    this.logout();
                } else {
                    alert('Internal Server Error');
                    this.logout();
                }
                this.ready = true;
            });
        } else {
            this.ready = true;
        }
    }

    private _renewToken() {
        return this._api.put('authenticate', null).then((res: any) => {
            return res.json().token;
        });
    }

    login(credentials: { email: string; password: string }) {
        return this._api.post('authenticate', credentials).then((res: any) => {
            let response = res.json();
            let token = response.token;
            this.isLoggedIn = true;
            this._setToken(token);
            this._router.navigate(['/dashboard']);
        });
    }

    logout() {
        this.isLoggedIn = false;
        this._clearToken();
        this._router.navigate(['/login']);
    }

    requestPasswordReset(email: string) {
        return this._api.post('resetpassword', { email });
    }

    resetPassword(password: string, token: string) {
        return this._api.post('resetpassword', { password, token });
    }

    private _setToken(token) {
        this._store.setString('authtoken', token);
        this._api.headers.set('Authorization', 'Bearer ' + token);
    }

    private _clearToken() {
        this._store.clearString('authtoken');
        this._api.headers.delete('Authorization');
    }
}
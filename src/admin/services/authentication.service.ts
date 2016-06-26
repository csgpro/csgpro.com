// angular
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

// app
import ApiService from './api.service';
import StoreService from './store.service';

@Injectable()
export default class AuthenticationService {

    isLoggedIn = false;

    constructor(private _api: ApiService, private _store: StoreService, private _router: Router) {
        const token = this._store.getString('authtoken');
        if (token) {
            this.isLoggedIn = true;
        }
    }

    login(credentials: { email: string; password: string }) {
        return this._api.post('authenticate', credentials).then(response => {
            this.isLoggedIn = true;
            this._store.setString('authtoken', response['token']);
            this._router.navigate(['/dashboard']);
        });
    }

    requestPasswordReset(email: string) {
        return this._api.post('resetpassword', { email });
    }

    resetPassword(email: string, token: string) {
        return this._api.post('resetpassword', { email, token });
    }
}
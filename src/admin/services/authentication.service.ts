// angular
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

// app
import ApiService from './api.service';
import StoreService from './store.service';

@Injectable()
export default class AuthenticationService {
    constructor(private _api: ApiService, private _store: StoreService, private _router: Router) {}

    login(credentials: { email: string; password: string }) {
        return this._api.post('authenticate', credentials).then(response => {
            this._store.setString('authtoken', response['token']);
            this._router.navigate(['/dashboard']);
        });
    }
}
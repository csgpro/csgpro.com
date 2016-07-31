// angular
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

// app
import {ApiService} from './api.service';
import {StoreService} from './store.service';
import {UploadService} from './upload.service';

@Injectable()
export class AuthenticationService {

    isLoggedIn = false;

    constructor(private _api: ApiService, private _store: StoreService, private _upload: UploadService, private _router: Router) {
        const token = this._store.getString('authtoken');
        if (token) {
            this._api.headers.append('Authorization', 'Bearer ' + token);
            this._upload.headers.append('Authorization', 'Bearer ' + token);
            this.isLoggedIn = true;
        }
    }

    login(credentials: { email: string; password: string }) {
        return this._api.post('authenticate', credentials).then((res: any) => {
            let response = res.json();
            let token = response.token;
            this.isLoggedIn = true;
            this._store.setString('authtoken', token);
            this._api.headers.append('Authorization', 'Bearer ' + token);
            this._router.navigate(['/dashboard']);
        });
    }

    logout() {
        this.isLoggedIn = false;
        this._store.clearString('authtoken');
        this._api.headers.delete('Authorization');
        this._router.navigate(['/login']);
    }

    requestPasswordReset(email: string) {
        return this._api.post('resetpassword', { email });
    }

    resetPassword(password: string, token: string) {
        return this._api.post('resetpassword', { password, token });
    }
}
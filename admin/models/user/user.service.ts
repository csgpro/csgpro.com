// angular
import { Injectable }         from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';

// libs
import { JwtHelper } from 'angular2-jwt';

// app
import { ApiService } from '../../services/api.service';
import { User }       from './user.model';
import { StoreService } from './../../services/store.service';

let jwtHelper = new JwtHelper();

@Injectable()
export class UserService {

    private _currentUser: User;

    constructor(private _apiService: ApiService, private _store: StoreService) {}

    get(userId?: number): Promise<User>;
    get(search?: RequestOptionsArgs): Promise<User[]>;
    get(search?: number|RequestOptionsArgs): any {
        if (typeof search === 'number') {
            return this._apiService.get<User>(`user/${search}`).then(u => new User(u));
        }
        return this._apiService.get<User>('user', search).then((users: User[]) => users.map(user => new User(user)));
    }

    get currentUser() {
        if (this._currentUser) {
            return Promise.resolve(this._currentUser);
        } else {
            let deserializedToken = jwtHelper.decodeToken(this._store.getString('authtoken'));
            let userId = deserializedToken.sub;
            return this.get(Number(userId)).then(user => {
                this._currentUser = user;
                return user;
            });
        }
    }
}
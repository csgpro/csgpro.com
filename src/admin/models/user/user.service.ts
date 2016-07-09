// angular
import {Injectable} from '@angular/core';
import {RequestOptionsArgs} from '@angular/http';

// app
import {ApiService} from '../../services/api.service';
import {User} from './user.model';

@Injectable()
export class UserService {
    constructor(private _apiService: ApiService) {}

    get(userId?: number): Promise<User>;
    get(search?: RequestOptionsArgs): Promise<User[]>;
    get(search?: number|RequestOptionsArgs) {
        if (typeof search === 'number') {
            return this._apiService.get<User>(`user/${search}`);
        }
        return this._apiService.get<User>('user', search);
    }
}
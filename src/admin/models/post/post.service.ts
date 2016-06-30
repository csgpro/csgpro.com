// angular
import {Injectable} from '@angular/core';
import {RequestOptionsArgs} from '@angular/http';

// app
import {ApiService} from '../../services/api.service';
import {Post} from './post.model';

@Injectable()
export class PostService {
    constructor(private _apiService: ApiService) {}

    get(postId?: number): Promise<Post>;
    get(search?: RequestOptionsArgs): Promise<Post[]>;
    get(search?: number|RequestOptionsArgs) {
        if (typeof search === 'number') {
            return this._apiService.get<Post>(`post/${search}`);
        }
        return this._apiService.get<Post>('post', search);
    }
}
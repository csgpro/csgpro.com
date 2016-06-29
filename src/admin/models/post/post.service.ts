// angular
import {Injectable} from '@angular/core';

// app
import {ApiService} from '../../services/api.service';
import {Post} from './post.model';

@Injectable()
export class PostService {
    constructor(private _apiService: ApiService) {}

    get(postId: number) {
        return this._apiService.get<Post>(`post/${postId}`);
    }
}
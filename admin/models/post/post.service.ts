// angular
import { Injectable }         from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';

// app
import { ApiService } from '../../services/api.service';
import { Post }       from './post.model';

@Injectable()
export class PostService {
    constructor(private _apiService: ApiService) {}

    get(postId?: number): Promise<Post>;
    get(search?: RequestOptionsArgs): Promise<Post[]>;
    get(search?: number|RequestOptionsArgs): any {
        if (typeof search === 'number') {
            return this._apiService.get<Post>(`post/${search}`).then(p => new Post(p));
        }
        return this._apiService.get<Post>('post', search).then((posts: Post[]) => posts.map(p => new Post(p)));
    }

    post(post: Post) {
        return this._apiService.post<Post>(`post`, post);
    }

    put(post: Post) {
        return this._apiService.put<Post>(`post/${post.id}`, post);
    }

    delete(post: Post) {
        return this._apiService.delete(`post/${post.id}`);
    }
}
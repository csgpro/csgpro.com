// app
import {Post} from '../post';

export class Category {
    id: number;
    category: string;
    slug: string;
    posts: Post[] = [];

    constructor(data?: any) {
        if (data && data.hasOwnProperty('id')) {
            Object.assign(this, data);
            if (this.posts) {
                this.posts = this.posts.map(post => new Post(post));
            }
        }
    }
}
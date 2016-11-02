// app
import { Post } from '../post';

export class Topic {
    id: number;
    topic: string;
    slug: string;
    active: boolean;
    posts: Post[] = [];

    constructor(data?: any) {
        Object.assign(this, data);
        if (this.posts) {
            this.posts = this.posts.map(post => new Post(post));
        }
    }
}
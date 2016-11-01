// app
import { Post } from '../post';

export class User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    twitterHandle: string;
    profilePhotoUrl: string;
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
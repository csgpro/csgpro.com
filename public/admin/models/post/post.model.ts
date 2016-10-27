// app
import { User }     from '../user';
import { Topic }    from '../topic';
import { Category } from '../category';

export class Post {
    id: number;
    title: string;
    post: string;
    excerpt: string;
    slug: string;
    publishedAt: Date;
    author: User = new User();
    topics: Topic[] = [];
    categoryId: number;
    category: Category = new Category();
    permalink: string;

    constructor(data?: any) {
        if (data && data.hasOwnProperty('id')) {
            Object.assign(this, data);
            if (this.author) {
                this.author = new User(this.author);
            }
            if (this.topics) {
                this.topics = this.topics.map(topic => new Topic(topic));
            }
            if (this.category) {
                this.category = new Category(this.category);
            }
        }
    }
}
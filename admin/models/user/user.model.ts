// app
import { Post } from '../post';
import { Role }       from '../../../server/shared/roles';

export class User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    twitterHandle: string;
    profilePhotoUrl: string;
    posts: Post[] = [];
    roleId: number;

    get role(): Role {
        return Role[Role[this.roleId]];
    }

    set role(value: Role) {
        this.roleId = Role[Role[value]];
    }

    isRole(roleName: string) {
        return this.role === Role[roleName];
    }

    constructor(data?: any) {
        Object.assign(this, data);
        if (this.posts) {
            this.posts = this.posts.map(post => new Post(post));
        }
    }
}
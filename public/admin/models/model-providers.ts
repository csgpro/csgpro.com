import {PostService} from './post';
import {CategoryService} from './category';
import {TopicService} from './topic';
import {UserService} from './user';
import {ContactService} from './contact';

export const MODEL_PROVIDERS = [
    PostService,
    CategoryService,
    TopicService,
    UserService,
    ContactService
];
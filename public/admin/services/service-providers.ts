import {AuthenticationService} from './authentication.service';
import {AuthGuard} from './auth.guard';
import {ApiService} from './api.service';
import {StoreService} from './store.service';
import {LoadingService} from './loading.service';
import {MarkdownService} from './markdown.service';

export const SERVICE_PROVIDERS = [
    AuthenticationService,
    AuthGuard,
    ApiService,
    StoreService,
    LoadingService,
    MarkdownService
];
// app
import { ApiService }            from './api.service';
import { AuthenticationService } from './authentication.service';
import { AuthGuard }             from './auth.guard';
import { StoreService }          from './store.service';
import { MarkdownService }       from './markdown.service';

export const ServiceProvider = [
    AuthenticationService,
    AuthGuard,
    ApiService,
    StoreService,
    MarkdownService
];
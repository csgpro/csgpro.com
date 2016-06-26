import AuthenticationService from './authentication.service';
import AuthGuard from './auth.guard';
import ApiService from './api.service';
import StoreService from './store.service';

export default [
    AuthenticationService,
    AuthGuard,
    ApiService,
    StoreService,
];
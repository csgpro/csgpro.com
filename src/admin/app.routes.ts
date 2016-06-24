// angular
import {provideRouter, RouterConfig} from '@angular/router';

// app
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';

export const routes: RouterConfig = [
    { path: '', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
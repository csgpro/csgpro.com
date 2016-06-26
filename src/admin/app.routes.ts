// angular
import {provideRouter, RouterConfig} from '@angular/router';

// app
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';

export const routes: RouterConfig = [
    { path: '', redirectTo: '/dashboard', terminal: true },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
// angular
import {provideRouter, RouterConfig} from '@angular/router';

// app
import {AuthGuard} from './services/auth.guard';

// pages
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {PostComponent} from './pages/posts/post.component';
import {PostsComponent} from './pages/posts/posts.component';

export const routes: RouterConfig = [
    { path: '', redirectTo: '/dashboard', terminal: true },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'post', redirectTo: '/posts', terminal: true},
    { path: 'posts', component: PostsComponent, canActivate: [AuthGuard] },
    { path: 'post/:id', component: PostComponent, canActivate: [AuthGuard] }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
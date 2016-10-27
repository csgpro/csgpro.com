// angular
import { RouterModule, Route } from '@angular/router';

// app
import { AuthGuard } from './services/auth.guard';

// pages
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PostComponent } from './pages/posts/post.component';
import { PostsComponent } from './pages/posts/posts.component';
import { ContactsComponent } from './pages/contacts/contacts.component';

export const routes: Route[] = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'posts', component: PostsComponent, canActivate: [AuthGuard] },
    { path: 'post/:id', component: PostComponent, canActivate: [AuthGuard] },
    { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
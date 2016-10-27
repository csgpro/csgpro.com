// export * from './contacts/contacts.component';
// export * from './dashboard/dashboard.component';
// export * from './login/login.component';
// export * from './posts/posts.component';
// export * from './posts/post.component';
// export * from './reset-password/reset-password.component';

import { ContactsComponent }              from './contacts/contacts.component';
import { DashboardComponent }           from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PostsComponent }                     from './posts/posts.component';
import { PostComponent }            from './posts/post.component';
import { ResetPasswordComponent }    from './reset-password/reset-password.component';

export const PageProvider = [ContactsComponent, DashboardComponent, LoginComponent, PostsComponent, PostComponent, ResetPasswordComponent];
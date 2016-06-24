// angular
import {bootstrap}    from '@angular/platform-browser-dynamic';
import {Title} from '@angular/platform-browser';

// app
import {AppComponent} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    Title
])
.catch(err => console.error(err));
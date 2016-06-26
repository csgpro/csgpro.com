// angular
import {bootstrap} from '@angular/platform-browser-dynamic';
import {Title} from '@angular/platform-browser';

// framework
import {CORE_PROVIDERS} from './framework';

// app
import {AppComponent} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';
import SERVICE_PROVIDERS from './services/service-providers';

bootstrap(AppComponent, [
    CORE_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    SERVICE_PROVIDERS,
    Title
])
.catch(err => console.error(err));
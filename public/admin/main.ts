// angular
import {enableProdMode} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {Title} from '@angular/platform-browser';

// app
import {AppComponent} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';
import {SERVICE_PROVIDERS} from './services/service-providers';
import {MODEL_PROVIDERS} from './models/model-providers';

enableProdMode();

bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    HTTP_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    SERVICE_PROVIDERS,
    MODEL_PROVIDERS,
    Title
])
.catch(err => console.error(err));
// angular
import {Component, ViewEncapsulation} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

// app
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app',
  template: `
    <header></header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['global.scss'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, HeaderComponent]
})
export class AppComponent {}
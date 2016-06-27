// angular
import {ViewEncapsulation} from '@angular/core';

// framework
import {BaseComponent} from './framework';

// app
import {HeaderComponent} from './components/header/header.component';

@BaseComponent({
  selector: 'app',
  template: `
    <header></header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['global.scss'],
  encapsulation: ViewEncapsulation.None,
  directives: [HeaderComponent]
})
export class AppComponent {}
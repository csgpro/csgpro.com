// framework
import {BaseComponent} from './framework';

// app
import {HeaderComponent} from './components/header/header.component';

@BaseComponent({
  selector: 'app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
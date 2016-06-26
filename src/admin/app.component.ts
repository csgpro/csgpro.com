// angular
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute, NavigationStart} from '@angular/router';

// app
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app',
  templateUrl: 'app.html',
  directives: [ROUTER_DIRECTIVES, HeaderComponent]
})
export class AppComponent implements OnInit, OnDestroy {
  portalTitle = 'CSG Pro Admin Portal';

  private sub: any;

  constructor(private _router: Router, private _route: ActivatedRoute) {
  }

  ngOnInit() {
    // TODO: Check if user is already logged in.
    this.sub = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.id === 1) {
        if (!/reset\-password/.test(event.url)) {
          this._router.navigate(['/login']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
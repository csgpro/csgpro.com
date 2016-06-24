// angular
import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

// app
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app',
  templateUrl: 'app.html',
  directives: [ROUTER_DIRECTIVES, HeaderComponent]
})
export class AppComponent implements OnInit {
  portalTitle = 'CSG Pro Admin Portal'

  ngOnInit() {
    // TODO: Check if user is already logged in.
    this._router.navigate(['/login']);
  }

  constructor(private _router: Router) {
  }
}
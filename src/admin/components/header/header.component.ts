// angular
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

// app
import {AuthenticationService} from '../../services/authentication.service';

@Component({
    selector: 'header',
    templateUrl: 'header.html',
    styleUrls: ['header.scss'],
    directives: [ROUTER_DIRECTIVES]
})
export class HeaderComponent {
    constructor(private _auth: AuthenticationService) { }

    logout() {
        this._auth.logout();
    }
}
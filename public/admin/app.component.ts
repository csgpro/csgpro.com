// angular
import { Component, ViewEncapsulation } from '@angular/core';

// app
import { AuthenticationService } from './services/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    constructor(private _auth: AuthenticationService) {}

    logout() {
        this._auth.logout();
    }
}
// angular
import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';

// app
import {AuthenticationService} from '../../services/authentication.service';

@Component({
    moduleId: 'DashboardComponent',
    templateUrl: 'dashboard.html',
    styleUrls: ['dashboard.scss']
})
export class DashboardComponent {
    title = 'Dashboard';
    constructor(private _title: Title, private _auth: AuthenticationService) {
        this._title.setTitle(this.title);
    }

    logout() {
        this._auth.logout();
    }
}
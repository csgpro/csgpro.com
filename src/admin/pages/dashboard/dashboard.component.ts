// angular
import {Title} from '@angular/platform-browser';

// framework
import {BaseComponent} from '../../framework';

// app
import {AuthenticationService} from '../../services/authentication.service';

@BaseComponent({
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
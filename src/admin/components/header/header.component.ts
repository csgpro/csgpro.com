// framework
import {BaseComponent} from '../../framework';

// app
import {AuthenticationService} from '../../services/authentication.service';

@BaseComponent({
    selector: 'header',
    templateUrl: 'header.html',
    styleUrls: ['header.scss']
})
export class HeaderComponent {
    constructor(private _auth: AuthenticationService) { }

    logout() {
        this._auth.logout();
    }
}
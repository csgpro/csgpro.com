// framework
import {BaseComponent} from '../../framework';

// app
import AuthService from '../../services/authentication.service';

@BaseComponent({
    selector: 'header',
    templateUrl: 'header.html',
    styleUrls: ['header.scss']
})
export class HeaderComponent {
    constructor(private _auth: AuthService) { }

    logout() {
        this._auth.logout();
    }
}
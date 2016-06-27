// angular
import {OnInit, OnDestroy} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

// framework
import {BaseComponent} from '../../framework';

// app
import AuthService from '../../services/authentication.service';

@BaseComponent({
    selector: 'header',
    templateUrl: 'header.html',
    styleUrls: ['header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    activeUrl: string;

    private sub: any;

    constructor(private _router: Router, private _auth: AuthService) { }

    logout() {
        this._auth.logout();
    }

    ngOnInit() {
        this.sub = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.activeUrl = event.url;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
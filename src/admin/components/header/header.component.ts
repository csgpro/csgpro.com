// angular
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, NavigationEnd} from '@angular/router';

@Component({
    selector: 'header',
    templateUrl: 'header.html',
    directives: [ROUTER_DIRECTIVES]
})
export class HeaderComponent implements OnInit, OnDestroy {

    visible = true;

    private sub: any;

    constructor(private _router: Router) { }

    ngOnInit() {
        this.sub = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.visible = (!/login|reset\-password/.test(event.url));
            }
        });
        console.log('Header initialized.');
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
// angular
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';

@Component({
    moduleId: 'ResetPasswordComponent',
    templateUrl: 'reset-password.html'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    title = 'Reset Password';

    email: string;

    private sub: any;

    constructor(private _title: Title, private _route: ActivatedRoute) {
        this._title.setTitle(this.title);
    }

    submit() {
        alert('Submit Not Implemented!');
    }
    
    ngOnInit() {
        this.sub = this._route.params.subscribe((params: {token: string}) => {
            const {token} = params;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
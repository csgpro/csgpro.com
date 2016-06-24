// angular
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    moduleId: 'ResetPasswordComponent',
    templateUrl: 'reset-password.html'
})
export class ResetPasswordComponent implements OnInit {
    title = 'Reset Password';

    email: string;

    constructor(private _title: Title) {
        this._title.setTitle(this.title);
    }

    submit() {
        alert('Submit Not Implemented!');
    }
    
    ngOnInit() {
        // Do something here when component is initialized
    }
}
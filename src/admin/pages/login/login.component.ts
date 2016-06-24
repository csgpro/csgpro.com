// angular
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    moduleId: 'LoginComponent',
    templateUrl: 'login.html', 
    directives: [ROUTER_DIRECTIVES]
})
export class LoginComponent implements OnInit {
    title = 'Login';

    email: string;
    password: string;

    constructor(private _title: Title) {
        this._title.setTitle(this.title);
    }

    submit() {
        alert('Submit Not Implemented!');
    }
    
    ngOnInit() {
        console.log(this.title);
    }
}
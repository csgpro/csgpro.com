// angular
import {OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

// framework
import {BaseComponent} from '../../framework';

// app
import AuthService from '../../services/authentication.service';
import ErrorSummary from '../../components/error-summary/error-summary.component';

@BaseComponent({
    moduleId: 'LoginComponent',
    templateUrl: 'login.html',
    directives: [ErrorSummary]
})
export class LoginComponent implements OnInit {
    title = 'Login';

    email: string;
    password: string;

    errors;

    constructor(private _title: Title, private _auth: AuthService) {
        this._title.setTitle(this.title);
    }

    submit() {
        this.errors = null;
        this._auth.login({ email: this.email, password: this.password }).catch((e: Error) => {
            this.errors = [e];
        });
    }
    
    ngOnInit() {
        console.log(this.title);
    }
}
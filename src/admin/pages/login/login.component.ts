// angular
import {OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

// framework
import {BaseComponent} from '../../framework';

// app
import {AuthenticationService} from '../../services/authentication.service';
import {ErrorSummary} from '../../components/error-summary/error-summary.component';

@BaseComponent({
    moduleId: 'LoginComponent',
    templateUrl: 'login.html',
    directives: [ErrorSummary]
})
export class LoginComponent implements OnInit {
    title = 'Login';

    email: string;
    password: string;

    get errors() {
        if (this._errors.size) {
            return Array.from(this._errors);
        }
    }

    constructor(private _title: Title, private _auth: AuthenticationService) {
        this._title.setTitle(this.title);
    }

    private _errors = new Set();

    submit() {
        this._errors.clear();
        if (!this.email) {
            this._errors.add({ message: 'Email Address is required.' });
        }
        if (!this.password) {
            this._errors.add({ message: 'Password is required.' });
        }
        if (this._errors.size) return;
        this._auth.login({ email: this.email, password: this.password }).catch((e: Error) => {
            this._errors.add(e);
        });
    }
    
    ngOnInit() {
        console.log(this.title);
    }
}
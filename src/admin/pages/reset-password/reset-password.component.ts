// angular
import {Title} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';

// app
import {BaseComponent} from '../../framework';
import ErrorSummary from '../../components/error-summary/error-summary.component';
import SuccessSummary from '../../components/success-summary/success-summary.component';
import AuthService from '../../services/authentication.service';

@BaseComponent({
    moduleId: 'ResetPasswordComponent',
    templateUrl: 'reset-password.html',
    directives: [ErrorSummary, SuccessSummary]
})
export class ResetPasswordComponent {
    title = 'Reset Password';

    email: string;
    password: string;
    confirmPassword: string;
    
    successMessage: string;

    get errors() {
        if (this._errors.size) {
            return Array.from(this._errors);
        }
    }

    constructor(private _title: Title, private _route: ActivatedRoute, private _auth: AuthService) {
        this._title.setTitle(this.title);
    }

    private _errors = new Set();

    requestReset() {
        this._errors.clear();
        if (!this.email) {
            this._errors.add({ message: 'Email Address is required.' });
            return;
        }
        this._auth.resetPassword(this.email)
        .then(() => {
            this.successMessage = 'Thank you. Please check your email shortly to reset your password.';
        })
        .catch((e: Error) => {
            this._errors.add(e);
        });
    }

    resetPassword() {
        this._errors.clear();
        if (!this.password) {
            this._errors.add({ message: 'New Password is required.' });
        }
        if (this.password && (this.confirmPassword !== this.password)) {
            this._errors.add({ message: 'Passwords do not match.' });
        }
        if (this._errors.size) return;
        this._auth.resetPassword(this.email)
        .then(() => {
            this.successMessage = 'Thank you. Please check your email shortly to reset your password.';
        })
        .catch((e: Error) => {
            this._errors.add(e);
        });
    }
}
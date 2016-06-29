// angular
import {OnInit, OnDestroy} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';

// app
import {BaseComponent} from '../../framework';
import {ErrorSummary} from '../../components/error-summary/error-summary.component';
import {SuccessSummary} from '../../components/success-summary/success-summary.component';
import {AuthenticationService} from '../../services/authentication.service';

@BaseComponent({
    moduleId: 'ResetPasswordComponent',
    templateUrl: 'reset-password.html',
    directives: [ErrorSummary, SuccessSummary]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    title = 'Reset Password';

    resetToken: string;

    email: string;
    password: string;
    confirmPassword: string;
    
    successMessage: string;

    private _paramSubscription: any;

    get errors() {
        if (this._errors.size) {
            return Array.from(this._errors);
        }
    }

    constructor(private _title: Title, private _route: ActivatedRoute, private _auth: AuthenticationService) {
        this._title.setTitle(this.title);
    }

    private _errors = new Set();

    requestReset() {
        this._errors.clear();
        if (!this.email) {
            this._errors.add({ message: 'Email Address is required.' });
            return;
        }
        this._auth.requestPasswordReset(this.email)
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
        if (!this.resetToken) {
            this._errors.add({ message: 'Missing reset password token.' });
        }
        if (this._errors.size) return;
        this._auth.resetPassword(this.password, this.resetToken)
        .then((a) => {
            // TODO: Log the user in.
            debugger;
        })
        .catch((e: Error) => {
            this._errors.add(e);
        });
    }

    ngOnInit() {
        this._paramSubscription = this._route.params.subscribe((params: any) => {
            let token = params.token;
            if (token) {
                this.resetToken = token;
            }
        });
    }

    ngOnDestroy() {
        this._paramSubscription.unsubscribe();
    }
}
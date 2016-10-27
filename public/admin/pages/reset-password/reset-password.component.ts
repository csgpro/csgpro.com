// angular
import { Component, ViewContainerRef }  from '@angular/core';
import { Title }                        from '@angular/platform-browser';
import { ActivatedRoute, Router }       from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

// app
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    templateUrl: 'reset-password.html'
})
export class ResetPasswordComponent {
    title = 'Reset Password';

    resetToken: string;

    email: string;
    password: string;
    confirmPassword: string;

    private _paramSubscription: any;

    constructor(private _title: Title, private _route: ActivatedRoute, private _router: Router, private _auth: AuthenticationService, private _snackBar: MdSnackBar, private _viewContainer: ViewContainerRef) {
        this._title.setTitle(this.title);
    }

    onSubmit() {
        if (this.resetToken) {
            this.resetPassword();
        } else {
            this.requestReset();
        }
    }

    requestReset() {
        let snackBarConfig = new MdSnackBarConfig(this._viewContainer);
        snackBarConfig.politeness = 'assertive';
        this._auth.requestPasswordReset(this.email)
        .then(() => {
            let message = 'Check your email';
            this._snackBar.open(message, 'OK', snackBarConfig);
        })
        .catch((error: Error) => {
            this._snackBar.open(error.message, 'OK', snackBarConfig);
        });
    }

    resetPassword() {
        let snackBarConfig = new MdSnackBarConfig(this._viewContainer);
        snackBarConfig.politeness = 'assertive';
        this._auth.resetPassword(this.password, this.resetToken)
        .then((a) => {
            this._router.navigate(['/login']);
        })
        .catch((error: Error) => {
            this._snackBar.open(error.message, 'OK', snackBarConfig);
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
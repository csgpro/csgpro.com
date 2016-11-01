// angular
import { Component, ViewContainerRef }  from '@angular/core';
import { Title }                        from '@angular/platform-browser';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

// app
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    templateUrl: 'login.html'
})
export class LoginComponent {
    title = 'Login';

    email: string;
    password: string;

    constructor(private _title: Title, private _auth: AuthenticationService, private _snackBar: MdSnackBar, private _viewContainer: ViewContainerRef) {
        this._title.setTitle(this.title);
    }

    onSubmit() {
        this._auth.login({ email: this.email, password: this.password }).catch((error) => {
            let snackBarConfig = new MdSnackBarConfig(this._viewContainer);
            snackBarConfig.politeness = 'assertive';
            this._snackBar.open(error.message, 'OK', snackBarConfig);
        });
    }
}
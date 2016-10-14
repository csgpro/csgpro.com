// angular
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

// app
import {AuthenticationService} from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthenticationService, private _router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Attempting to avoid race condition.
    // If the auth service isn't ready then wait a bit and
    // redirect to the dashboard if logged in.
    // If not logged in, redirec to the login page.
    if (!this._auth.ready) {
        let delayCycles = 5;
        let authReady = setInterval(() => {
            delayCycles--;
            
            if (delayCycles === 0) {
                clearInterval(authReady);
                if (this._auth.isLoggedIn) {
                    this._router.navigate(['/dashboard']);
                } else {
                    this._router.navigate(['/login']);
                }
            }
        }, 200);
        return false;
    } else {
        if (this._auth.isLoggedIn) { return true; }
        this._router.navigate(['/login']);
        return false;
    }
  }
}
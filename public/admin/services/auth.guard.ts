// angular
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

// app
import {AuthenticationService} from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthenticationService, private _router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return new Promise((resolve, reject) => {
          if (!this._auth.isAuthenticated()) {
              this._router.navigate(['/login']);
              resolve(false);
          } else {
              resolve(true);
          }
      });
  }
}
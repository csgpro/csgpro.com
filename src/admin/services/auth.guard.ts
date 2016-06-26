// angular
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

// app
import AuthService from './authentication.service';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._auth.isLoggedIn) { return true; }
    this._router.navigate(['/login']);
    return false;
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JWTTokenService } from './token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JWTTokenService,
		private router: Router
	) { }
	
	canActivate(
		_next: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	) {
		if (this.jwtService.getUser()) {
			if (this.jwtService.isTokenExpired()) {
				this.router.navigate(['/'])
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
}
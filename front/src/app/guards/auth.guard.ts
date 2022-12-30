import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthTokenService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor ( 
        private tokenService: AuthTokenService,
        private snackBar: MatSnackBar,
        private userService : UserService,
        private jwt : JwtHelperService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = this.tokenService.getToken();
        this.userService.isLoggedIn().subscribe(
            (data : any) => {}
        )
        if (token) {
            if (this.jwt.isTokenExpired(token)) {
                this.tokenService.removeToken();
                this.snackBar.open("Le token est expire", 'X', {
                duration: 3000
            })
                return false;
            }
            return true;
        }
        else {
            this.tokenService.removeToken();
            this.snackBar.open("Vous devez vous connecter", 'X', {
                duration: 3000
            })
            return false;
        }
    }
}
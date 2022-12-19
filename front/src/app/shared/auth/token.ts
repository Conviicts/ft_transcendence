import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { CookieService } from './cookies';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {
	jwtToken: string;
    decodedToken: { [key: string]: string };

    constructor(private cookieService: CookieService) {
		this.jwtToken = this.cookieService.get("jwt");
		this.decodedToken = { };
	}
	
	setToken(token: string) {
		if (token) {
		  this.jwtToken = token;
		}
	}

	decodeToken() {
		if (this.jwtToken) {
		this.decodedToken = jwt_decode(this.jwtToken);
		}
	}

	getDecodeToken() {
		return jwt_decode(this.jwtToken);
	}

	getUser() {
		this.decodeToken();
		return this.decodedToken ? this.decodedToken['username'] : null;
	}

	getUserData() {
		this.decodeToken();
		return this.decodedToken ? 
			{
				"username": this.decodedToken['username'],
				"status": this.decodedToken['status'],
				"login42": this.decodedToken['login42'],
			}
			:
			null;
	}

	getExpiryTime() {
		this.decodeToken();
		return this.decodedToken ? this.decodedToken['exp'] : null;
	}

	isTokenExpired(): boolean {
	const expiryTime: any = this.getExpiryTime();
	if (expiryTime) {
		return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
	} else {
		return false;
	}
	}
}

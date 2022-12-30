import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'jwt';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  constructor(private jwtHelper: JwtHelperService) { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public getId(): number | null {
    const tokenString = this.getToken();
    if (tokenString)
      return this.jwtHelper.decodeToken(tokenString).sub;
    return null;
  }

  public TFAEnabled(): boolean {
    const tokenString = this.getToken();
    if (tokenString)
      return this.jwtHelper.decodeToken(tokenString).TFAEnabled;
    return false;
  }

  logOut(): void {
    window.localStorage.clear();
  }
}

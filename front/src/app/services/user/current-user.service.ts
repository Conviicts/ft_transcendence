import { EnvironmentInjector, Injectable } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { IUser } from "src/app/models/user.model";
import { AuthTokenService } from "../auth/auth.service";
import { API_URI } from "../config";


@Injectable()
export class CurrentUserService {
    user!: Observable<IUser>;
    subscription!: Subscription;
    
    private backUrl = `${API_URI}`;

    constructor(
        private token: AuthTokenService,
        private http: HttpClient
    ) {
        if (this.token.getToken()) {
          this.user = this.getCurrenUserB();
        }
    }

    initConnection(): void {
        if (this.token.getToken()) {
          this.user = this.getCurrenUserB();
        }
    }

    getCurrentUser(): Observable<IUser> {
        return this.user;
    }

    getCurrenUserB(): Observable<IUser> {
      return this.http.get<IUser>(this.backUrl + "user/me", {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
    }

    getFriends(): Observable<any> {
      return this.http.get<any>(this.backUrl + "user/friends/get", {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
    }

    getBlockedUsers(): Observable<any> {
      return this.http.get<any>(this.backUrl + "user/blocked", {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
    }
}
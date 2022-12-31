import { EnvironmentInjector, Injectable } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { IUser, TFASecret } from "src/app/models/user.model";
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

	GetUserHistory(id: number) {
		return this.http.get(`${API_URI}user/profile/${id}`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	ChangeDbInformation(user: IUser): Observable<any> {
		return this.http.put<Observable<any>>(`${API_URI}user`, user, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	ActivateFacode(code: string): Observable<any> {
		return this.http.post<Observable<any>>(`${API_URI}auth/2fa/enable`,{"twoFactorAuthenticationCode": code}, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	DesactivateFacode(): Observable<any> {
		return this.http.get<Observable<any>>(`${API_URI}auth/2fa/disable`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	Validate2FACode(code: number):Observable<any> {
		return this.http.post<Observable<any>>(`${API_URI}auth/2fa`,{"twoFactorAuthenticationCode": code}, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	GetSecret2Fa(): Observable<TFASecret> {
		return this.http.get<TFASecret>(`${API_URI}auth/2fa/secret`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	RegenerateSecret2Fa(): Observable<TFASecret> {
		return this.http.post<TFASecret>(`${API_URI}auth/2fa/reset`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}
}
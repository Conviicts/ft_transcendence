import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient) {}

	login() {
		window.location.href = 'http://localhost:8080/api/auth/login';
	}

	profil(): Observable<UserModel> {
		return this.http.get<UserModel>("http://localhost:8080/api/user/me", { withCredentials:true });
	}
}

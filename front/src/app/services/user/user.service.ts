import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { __values } from 'tslib';

import { FriendsRequestAction } from 'src/app/models/friends.model';
import { IUser} from 'src/app/models/user.model';
import { AuthTokenService } from '../auth/auth.service';
import { API_URI } from '../config';

@Injectable()
export class UserService {
    userList!: IUser[];

    constructor (
        private http: HttpClient,
        private token: AuthTokenService,
    ) {}

	getOnlineUsers(): Observable<IUser> {
		const token = this.token.getToken();
		if (token)
		return this.http.get<IUser>(`${API_URI}user/me`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
		throw new Error('No token');
	}

	changeUserList(tab: IUser[]): void {
		this.userList = tab;
	}

	getUserList(): IUser[] {
		return this.userList;    
	}

	getUsers(): Observable<IUser[]> {
		return this.getUsersData();
	}

	getUserById(id: number): IUser {
		var i = 0;
		while (this.userList[i]) {
			if (id === this.userList[i].id )
				return this.userList[i];
			i++;
		}
		throw new Error('User not found!');
	}

	getUserByIdBack(id: number): Observable<any> {
		return this.http.get<IUser>(`${API_URI}user/profile/` + id, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	getUsersData(): Observable<IUser[]> {
		return this.http.get<IUser[]>(`${API_URI}user/`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	FindByName(name: string): Observable<IUser[]> {
		return this.http.get<IUser[]>(`${API_URI}user/search/${name}`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	getFriends(): Observable<IUser[]> {
		return this.http.get<IUser[]>(`${API_URI}user/friends/get`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	getFriendRequests(): Observable<any[]> {
		return this.http.get<any>(`${API_URI}user/friends/pending`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	acceptFriendRequest(id: number) {
		return this.http.get(`${API_URI}user/friends/accept/${id}`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	declineFriendRequest(id: number) {
		return this.http.get(`${API_URI}user/friends/decline/${id}`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	removeFriend(userId: any) {
		return this.http.get(`${API_URI}user/friends/remove/${userId}`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});

	}

	respondFriendRequest(requestId: number, accept: FriendsRequestAction) {
		return this.http.post(`${API_URI}user/friends`, {requestId: requestId, action: accept}, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	sendRequest(userId: number) {
		return this.http.post(`${API_URI}user/friends/request`, {toId: userId}, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	uploadAvatar(avatar: any) {
		return this.http.post(`${API_URI}user/avatar`, avatar ,{headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	blockUser(id: any) {
		return this.http.post(`${API_URI}user/block/${id}`,  null, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	unBlockUser(id: any) {
		return this.http.post(`${API_URI}user/unblock/${id}`, null ,{headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	isLoggedIn(): Observable<boolean> {
		return this.http.get<boolean>(`${API_URI}user/me`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	GetUserHistory(id: number) {
		return this.http.get(`${API_URI}user/profile/${id}`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}

	GetLeaderBoard(): Observable<any[]> {
		return this.http.get<any[]>(`${API_URI}game/leaderboard`, {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token.getToken()})});
	}
}
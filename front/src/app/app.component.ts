import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './shared/auth/auth.service';
import { User, UserModel } from './shared/models/user.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'front';
	user: User;

	constructor(private authService: AuthService) {
		this.user = new User({uid: 0, username: ''});
	}

	login() {
		this.authService.login();
	}

	async ngOnInit() {
		this.authService.profil()
		.subscribe(
			(data: UserModel) => {
				this.user = new User(data)
			},
			error => console.log('oops', error)
		);
	}
}

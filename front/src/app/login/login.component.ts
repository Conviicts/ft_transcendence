import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from 'src/app/services/auth/auth.service';
import { API_URI } from 'src/app/services/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	constructor (
		private tokenService : AuthTokenService,
		private router : Router,
	) { }

	loginPath = `${API_URI}auth/42`;

	ngOnInit(): void {
		if (this.tokenService.getToken())
			this.router.navigate(["game"])
	}
}

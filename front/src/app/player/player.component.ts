import { Component, OnInit } from '@angular/core';
import { IUser, TFASecret } from '../models/user.model';
import { CurrentUserService } from '../services/user/current-user.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

	MyUser!:IUser;
	MyTFA?: TFASecret;
	code!: string;

	constructor(public currentUser : CurrentUserService) {
	}

	ngOnInit(): void {
		this.code = '1234';
		this.currentUser.getCurrenUserB().subscribe(data => {
			this.MyUser = data;
		});
	}

	onGet2FA() 
	{
		this.currentUser.GetSecret2Fa().subscribe(TFA => {
			this.MyTFA = TFA;
			console.log(this.MyTFA);
			this.currentUser.ActivateFacode(this.code);
			this.currentUser.RegenerateSecret2Fa();
			this.currentUser.ChangeDbInformation(this.MyUser);

			console.log(this.MyUser);
		});

	}
}

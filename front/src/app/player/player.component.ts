import { Component, OnInit } from '@angular/core';
import { IUser, TFASecret } from '../models/user.model';
import { CurrentUserService } from '../services/user/current-user.service';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

	file!: File;
	MyUser!:IUser;
	MyTFA?: TFASecret;
	code!: string;
	avatar?: string;

	constructor(public currentUser : CurrentUserService) {
	}

	ngOnInit(): void {
		this.code = '1234';
		this.currentUser.getCurrenUserB().subscribe(data => {
			this.MyUser = data;
			this.avatar = data.avatar;
		});
	}

	onFileChange(event : any) {
		this.file = event.target.files[0];
	}
	
	async uploadFile() {
		const formData = new FormData();
		formData.append('file', this.file);
		//this.currentUser.Uplaodfile(this.file);
	}

	onGet2FA() 
	{
		this.currentUser.GetSecret2Fa().subscribe(TFA => {
			this.MyTFA = TFA;
			this.currentUser.GetSecret2Fa();
			console.log(this.MyUser);
		});
		this.currentUser.getCurrenUserB().subscribe(data => {
			console.log(this.MyUser);
		});

	}



	debug() {
		console.log(this?.MyUser);
		console.log(this?.MyTFA);
		console.log(this?.file);
	}
}

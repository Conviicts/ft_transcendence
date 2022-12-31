import { Component, OnInit } from '@angular/core';
import { IUser } from '../models/user.model';
import { CurrentUserService } from '../services/user/current-user.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit {

	MyUser?:IUser;
	
	constructor(public currentUser : CurrentUserService) {
	}

	ngOnInit(): void {
		this.currentUser.getCurrenUserB().subscribe(data => {
			this.MyUser = data;
			console.log(this.MyUser);
		});

	}
}

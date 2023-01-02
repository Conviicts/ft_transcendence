import { Component, OnInit } from '@angular/core';
import { IUser } from '../models/user.model';
import { CurrentUserService } from '../services/user/current-user.service';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit {

	MyUser?:IUser;
	channel_n: string;

	
	constructor(public currentUser : CurrentUserService, public chatService : ChatService) {
		this.channel_n = '';

	}

	createChannel() {
		// if (this.channel_n)
		//   this.chatservice.createChannel(this.channel_n);
	}

	loadProfil(){

	}
	  
	ngOnInit(): void {
		this.currentUser.getCurrenUserB().subscribe(data => {
			this.MyUser = data;
			this.createChannel();
		});
	}

}

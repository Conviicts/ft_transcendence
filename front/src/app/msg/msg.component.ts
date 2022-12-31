import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat/chat.service';
import { Message, ChatRoom } from '../models/chat.model';
import { CurrentUserService } from '../services/user/current-user.service';
import { IUser } from '../models/user.model';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss']
})
export class MsgComponent {

	message!: Message;
	//msgs : Message[] = [];
	newMessage:string =  '';
	user?: IUser;

	constructor (public chatService : ChatService, public currUser : CurrentUserService) {
		currUser.getCurrenUserB().subscribe(data => {
			this.user = data;
		})
		
	}


  	sendMessage() {
		const message: Message = {
			content: this.newMessage,
			user: { id: this.user?.id, username: this.user?.username} as IUser,
			room: { id: 1, name: 'Room 1' } as ChatRoom,
			createdAt: new Date(),
			updatedAt: new Date(),
			seenBy: []
		};
		//this.msgs.push(this.newMessage);
	 	this.chatService.sendMessage(this.message);
	}
}
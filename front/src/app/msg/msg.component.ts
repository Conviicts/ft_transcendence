import { Component } from '@angular/core';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss']
})
export class MsgComponent {

	messages: {text: string}[] = [];
	newMessage = '';
  
	sendMessage() {
	  this.messages.push({text: this.newMessage});
	  this.newMessage = '';
	}
}

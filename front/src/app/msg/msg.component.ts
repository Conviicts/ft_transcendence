import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss']
})

export class MsgComponent implements AfterViewChecked  {

	@ViewChild('scrollMe') private myScrollContainer!: ElementRef;

	constructor(private chatService : ChatService) {
	}


	ngAfterViewChecked() {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} 
		catch(err) { }
	}

	messages: {text: string}[] = [];
	newMessage :string = '';

	sendMessage() {
	
	  this.messages.push({text: this.newMessage});
	  this.messages
	  this.newMessage = '';
	}
}
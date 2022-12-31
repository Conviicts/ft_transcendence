import { Component } from '@angular/core';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss']
})
export class MsgComponent {

	messages: {text: string}[] = [];
	newMessage :string = '';

	sendMessage() {
	  this.messages.push({text: this.newMessage});
	  this.newMessage = '';
	}
}

/*import { Component, OnInit } from '@angular/core';
//import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.css']
})

export class MsgComponent /*implements OnInit {
  /*contacts = [
    { name: 'John Doe' },
    { name: 'Jane Doe' },
    { name: 'James Smith' },
    { name: 'Mary Johnson' }
  ];
  messages = [];
  newMessageText = '';

  constructor(private socket: Socket) { }

  ngOnInit() {
    this.socket.on('message', (data) => {
      this.handleMessage(data);
    });

    this.socket.emit('getMessages');
  }

  handleMessage(data) {
    // mettez à jour la liste des messages avec le nouveau message reçu
   // this.messages.push(data);
  }*/

 /* sendMessage() {
    if (this.newMessageText.trim().length === 0) {
      return;
    }

    // utilisez la connexion Socket.IO pour envoyer le nouveau message au serveur
    this.socket.emit('sendMessage', { text: this.newMessageText });
    this.newMessageText = '';
  }
}*/

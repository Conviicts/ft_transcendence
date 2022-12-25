import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

interface IChannel {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    private socket: Socket;
    channels: IChannel[] = [];
    messages: string[];
  
    constructor() {
      this.messages = [];
      this.socket = io('http://localhost:3000/tchat', { withCredentials: true });
      
      this.socket.on('channels', message => {
        this.channels = message.all_channels;
        console.log(this.channels);
      });

      this.socket.on('channel', channel => {
        this.channels.push(channel)
      });

      this.socket.on('addmessage', (msg: string) => {
        this.messages.push(msg)
      });

      
    }

    createChannel(name: string) {
      let newChan: any;

      newChan = {};
      newChan.name = name;
      newChan.public = true;

      this.socket.emit('createChannel', newChan);
    }

    addMessage(id:number, msg: string) {
      let message: any;

      message = {};
      message.id = id;
      message.value = msg;

      this.socket.emit('addMessage', message);
    }
  
    sendMessage(message: string) {
      this.socket.emit('new message', message);
    }
}
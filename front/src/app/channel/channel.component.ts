import { Component } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})

export class ChannelComponent {
  channel_n: string;

  constructor(public chatservice: ChatService) {
    this.channel_n = '';
  }

  createChannel() {
    // if (this.channel_n)
    //   this.chatservice.createChannel(this.channel_n);
  }

  ngOnInit() {
    this.createChannel();
  }
}

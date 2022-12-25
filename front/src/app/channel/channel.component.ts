import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { JWTTokenService } from '../shared/auth/token';
import { ChatService } from '../shared/chat/chat.service';
import { User, UserModel } from '../shared/models/user.model';

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
    if (this.channel_n)
      this.chatservice.createChannel(this.channel_n);
  }

  ngOnInit() {
    this.createChannel();
  }
}

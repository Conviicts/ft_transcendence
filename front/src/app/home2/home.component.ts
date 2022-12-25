import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { JWTTokenService } from '../shared/auth/token';
import { ChatService } from '../shared/chat/chat.service';
import { ImageService } from '../shared/image.service';
import { User, UserModel } from '../shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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

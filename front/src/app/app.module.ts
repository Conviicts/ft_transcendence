import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from './shared/auth/cookies';
import { AuthService } from './shared/auth/auth.service';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { MsgComponent } from './msg/msg.component';
import { ChannelComponent } from './channel/channel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    MsgComponent,
    ChannelComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
	HttpClientModule,
	FormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}

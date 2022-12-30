import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MsgComponent } from './msg/msg.component';
import { ChannelComponent } from './channel/channel.component';
import { MainComponent } from './main/main.component';
import { PlayersComponent } from './players/players.component';
import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { PongComponent } from './pong/pong.component';
import { LoginComponent } from './login/login.component';
import { TokenComponent } from './token/token.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarService } from './services/user/navbar.service';
import { UserService } from './services/user/user.service';
import { CurrentUserService } from './services/user/current-user.service';

const config: SocketIoConfig = {
  url: 'http://localhost:3001', options: {
    query: {
      token: localStorage.getItem('auth')
    }
  },
};

export function tokenGetter() {
  return localStorage.getItem("auth");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MsgComponent,
    ChannelComponent,
    MainComponent,
    PlayersComponent,
    LeftComponent,
    RightComponent,
    PongComponent,
    LoginComponent,
    TokenComponent,
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000']
      }
    }),
    SocketIoModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [NavBarService, UserService, CurrentUserService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {}

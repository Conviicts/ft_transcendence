import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CookieService } from './shared/auth/cookies';
import { AuthService } from './shared/auth/auth.service';
import { ImageService } from './shared/image.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
	HttpClientModule
  ],
  providers: [CookieService, ImageService],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { JWTTokenService } from '../shared/auth/token';
import { ImageService } from '../shared/image.service';
import { User, UserModel } from '../shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  imageToShow: any;
  isImageLoading: boolean;

  constructor(private imageService: ImageService) {
    this.isImageLoading = false;
  }

  createImageFromBlob(image: Blob) {
   let reader = new FileReader();
   reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
   }, false);
   console.log(this.imageToShow)
   if (image) {
      reader.readAsDataURL(image);
   }
  }

  getImageFromService() {
      this.isImageLoading = true;
      this.imageService.getImage("http://localhost:8080/api/auth/2fa").subscribe(data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = false;
        console.log(error);
      });
  }
}

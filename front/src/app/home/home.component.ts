import { Component } from '@angular/core';
import { FaceSnap } from '../chat/chat.component';
import { ChatService } from '../shared/chat/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
	title = "Front";
	FaceSnaps!:  FaceSnap[];
	constructor(public chatservice: ChatService) {}
  ngOnInit() {
	this.FaceSnaps = [
		{
			title: 'Archibald',
			description: 'Mon meilleur ami depuis tout petit !',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
			createdDate: new Date(),
			snaps: 250,
			location: 'Paris'
		},
		{
			title: 'Three Rock Mountain',
			description: 'Un endroit magnifique pour les randonnées.',
			imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Three_Rock_Mountain_Southern_Tor.jpg/2880px-Three_Rock_Mountain_Southern_Tor.jpg',
			createdDate: new Date(),
			snaps: 154,
			location: 'Vide'
		},
		{
			title: 'Un bon repas',
			description: 'Mmmh que c\'est bon !',
			imageUrl: 'https://wtop.com/wp-content/uploads/2020/06/HEALTHYFRESH.jpg',
			createdDate: new Date(),
			snaps: 90
		},
		{
			title: 'Archibald',
			description: 'Mon meilleur ami depuis tout petit !',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
			createdDate: new Date(),
			snaps: 1,
			location: 'Paris'
		},
		{
			title: 'Three Rock Mountain',
			description: 'Un endroit magnifique pour les randonnées.',
			imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Three_Rock_Mountain_Southern_Tor.jpg/2880px-Three_Rock_Mountain_Southern_Tor.jpg',
			createdDate: new Date(),
			snaps: 8,
			location: 'Vide'
		},
		{
			title: 'Un bon repas',
			description: 'Mmmh que c\'est bon !',
			imageUrl: 'https://wtop.com/wp-content/uploads/2020/06/HEALTHYFRESH.jpg',
			createdDate: new Date(),
			snaps: 0
		},
		{
			title: 'Archibald',
			description: 'Mon meilleur ami depuis tout petit !',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
			createdDate: new Date(),
			snaps: 0,
			location: 'Paris'
		},
		{
			title: 'Three Rock Mountain',
			description: 'Un endroit magnifique pour les randonnées.',
			imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Three_Rock_Mountain_Southern_Tor.jpg/2880px-Three_Rock_Mountain_Southern_Tor.jpg',
			createdDate: new Date(),
			snaps: 0,
			location: 'Vide'
		},
		{
			title: 'Un bon repas',
			description: 'Mmmh que c\'est bon !',
			imageUrl: 'https://wtop.com/wp-content/uploads/2020/06/HEALTHYFRESH.jpg',
			createdDate: new Date(),
			snaps: 0
		},
	];
  }
}

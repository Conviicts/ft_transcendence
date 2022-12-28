import { Component } from '@angular/core';
import { Player } from '../players/players.component';
import { ChatService } from '../shared/chat/chat.service';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent {
	player_test!: Player;
	Players!:  Player[];

	constructor(public chatservice: ChatService) {
	}
	ngOnInit() {
	this.Players = [
		{
			username: 'Archibald',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
			status: 'online'
		},
		{
			username: 'Three Rock Mountain',
			imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Three_Rock_Mountain_Southern_Tor.jpg/2880px-Three_Rock_Mountain_Southern_Tor.jpg',

		},
		{
			username: 'Un bon repas',
			imageUrl: 'https://wtop.com/wp-content/uploads/2020/06/HEALTHYFRESH.jpg',
		},
		{
			username: 'Archibald',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
			status: 'online'

		},
		{
			username: 'Three Rock Mountain',

			imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Three_Rock_Mountain_Southern_Tor.jpg/2880px-Three_Rock_Mountain_Southern_Tor.jpg',
		},
		{
			username: 'Un bon repas',
			imageUrl: 'https://wtop.com/wp-content/uploads/2020/06/HEALTHYFRESH.jpg',
			status: 'online'

		},
		{
			username: 'Archibald',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
			status: 'online'
		},
		{
			username: 'Three Rock Mountain',
			imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Three_Rock_Mountain_Southern_Tor.jpg/2880px-Three_Rock_Mountain_Southern_Tor.jpg',

		},
		{
			username: 'Un bon repas',
			imageUrl: 'https://wtop.com/wp-content/uploads/2020/06/HEALTHYFRESH.jpg',

		},
		];
		this.player_test = this.Players[1];
  }
}

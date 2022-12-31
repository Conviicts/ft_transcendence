import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent {
	@Input() player! : Player;

	constructor () {
	}
	
	onGame() {

	};
	onMessages()  {

	};
}

export class Player {
    uid?: string;
    username!:string;
	imageUrl!: string;
    email?: string;
    login42?: string;
    have2FA?: boolean;
    isAdmin?: boolean;
    status?: string;
    friends?: [];
    restricted?: [];
    createdAt?: string;
    updatedAt?: string;
}

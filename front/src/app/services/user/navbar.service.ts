import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

export interface IInvitedGame {
  gameId: any,
  inviter_name: string,
}

@Injectable()
export class NavBarService  {
  visible: boolean;

  
  constructor(
    private socket: Socket,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.socket.on('redirectGame', (gameId: number) => {
      this.redirectToGame(gameId);
      this.dialog.closeAll();
    });
    this.socket.on('invited', (data: IInvitedGame) => {
		//TODO: open popup
    });
    this.visible = false; 
  }


  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() { this.visible = !this.visible; }

  async redirectToGame(gameId: number) {
    this.router.navigate(['/home/']);
    setTimeout(() => {
      this.router.navigate(['/home/' + gameId]);
    }, 100);
  }
}
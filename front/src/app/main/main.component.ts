import { Component, Input, Output,OnInit, ViewChild, ViewContainerRef, EventEmitter } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { MsgComponent } from '../msg/msg.component';
import { PongComponent } from '../pong/pong.component';
import { Player } from '../players/players.component';

@Component({
  selector: 'app-main',
  template: '<ng-container #container></ng-container>',
})

export class MainComponent implements OnInit {
	@Input() component: string;
	@Output() componentChange = new EventEmitter<string>();

	@ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

	constructor(private viewContainerRef: ViewContainerRef) {
		this.container = viewContainerRef;
		this.component = 'msg';
	}

	ngOnInit() {
  		if (this.component === 'player') {
		  	this.container.clear()
			this.container.createComponent(PlayerComponent);
		}
  		else if (this.component === 'msg') {
			this.container.clear()
			this.container.createComponent(MsgComponent);
		}
	};
}
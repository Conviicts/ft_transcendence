import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})


export class ChatComponent implements OnInit {
	@Input() faceSnap! : FaceSnap;
	snaped!: boolean;
	buttonText!: string;

	ngOnInit() {
		this.snaped = false;
		this.buttonText = "Oh snap";
	}

	onSnap () {
		if (!this.snaped)
		{
			this.faceSnap.snaps++;
			this.snaped = true;
			this.buttonText = "snapped";

		}
		else
		{
			this.faceSnap.snaps--;
			this.snaped = false;
			this.buttonText = "Oh snap";

		}
	}
}

export class FaceSnap {
	title!: string;
	description!: string;
	imageUrl!: string;
	createdDate!: Date;
	snaps!: number;
	location?: string;
}

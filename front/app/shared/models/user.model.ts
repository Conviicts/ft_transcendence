export interface UserModel {
	uid: string;
	username: string;
}

export class User implements UserModel {
	uid: string;
	username: string;
	email?: string;

	constructor(user: any) {
		this.uid = user.id;
		this.username = user.username;
	}
}
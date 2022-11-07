import { IChannel } from "../../tchat/interfaces/channel.interface";
import { User } from "../entities/user.entity";

export interface IUserRole {
	roleUserId?: string;
	userId: string;
	ban?: Date;
    mute?: Date;
	channel: IChannel;
}

export interface IUserConnected {
	userId?: string;
	socketId: string;
	user: User;
}
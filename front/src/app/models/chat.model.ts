import { IUser, User } from "./user.model";

export enum ChatRoomType {
    DM = "DM",
    GROUP = "GROUP",
}

export interface Message {
    id?: number;
    content?: string;
    user: IUser;
    room: ChatRoom;
    createdAt?: Date;
    updatedAt?: Date;
    seenBy?: User[];
}

export interface ChatRoom {
    id?: number;
    name?: string;
    description?: string;
    users?: IUser[];
    type?: ChatRoomType;
    messages?: Message[];
    penalities?: any[];
    ownerId?: number;
    admins?: IUser[];
    public?: boolean;
    seen?: boolean;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface NewRoom {
    name: string;
    description: string;
    users: IUser[];
    public: boolean;
    password?: string;
}
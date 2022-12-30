import { ChatRoomType, Message, User } from '@prisma/client';
import { IBasicUser } from 'src/user/interfaces/user.interface';

export interface ChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: IBasicUser[];
  messages?: Message[];
  created_date?: Date;
  updatedAt?: Date;
}

export interface INewChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: IBasicUser[];
  public?: boolean;
  password?: string;
}

export interface IChatRoom {
  id: number;
  name: string;
  description: string;
  type: ChatRoomType;
  ownerId: number;
  users: IBasicUser[];
  admins: IBasicUser[];
  public: boolean;
  seen?: boolean;
  messages?: Message[] | any;
}

export interface IDMChatRoom {
  id: number;
  name: string;
  ownerId: number;
  type: ChatRoomType;
  users: IBasicUser[];
  seen?: boolean;
  messages?: any[];
}

export interface IPardon {
  userId: number;
  penaltyId: number;
}

export interface IMessage {
  id: number;
  content: string;
  user: User;
  room: IChatRoom;
}

export interface IEditChatRoom {
  userId: number;
  room: ChatRoom;
}

export class AdminUpdateEvent {
  isPromote: boolean;
  user: IBasicUser;
  promoter: IBasicUser;
  room: ChatRoom;
}

export class RoomUpdateEvent {
  user: IBasicUser;
  room: IChatRoom;
  success?: boolean;
  message?: string;
}

export class MessageUpdateEvent {
  room: IChatRoom;
}

export class NewRoomEvent {
  room: IChatRoom;
}

export class UserJoinEvent {
  room: IChatRoom;
  user: IBasicUser;
  success: boolean;
  message?: string;
}

export class UserLeaveEvent {
  room: IChatRoom;
  user: IBasicUser;
}

export class UserKickEvent {
  room: IChatRoom;
  user: IBasicUser;
  kicker: IBasicUser;
}

export class UserPunishEvent {
  room: IChatRoom;
  user: IBasicUser;
  punisher: IBasicUser;
  type: string;
  success: boolean;
  message?: string;
}

export class PardonEvent {
  room: IChatRoom;
  user: IBasicUser;
  pardonner: IBasicUser;
  success: boolean;
  message?: string;
}

export class UserCanChatEvent {
  room: IChatRoom;
  user: IBasicUser;
  message: string;
}

export class BlockedUserEvent {
  user: IBasicUser;
  blocker: IBasicUser;
  block: boolean;
  success: boolean;
}

export class DeleteRoomEvent {
  room: IChatRoom;
  user: IBasicUser;
  success: boolean;
  message?: string;
}

export interface UserInvitedEvent {
  room: IChatRoom;
  user: IBasicUser;
  inviter: IBasicUser;
}

import { IsEnum, IsInt } from 'class-validator';

export enum FriendRequestAction {
  ACCEPT,
  DECLINE,
}

export class FriendRequestDto {
  @IsInt()
  readonly requestId: number;

  @IsEnum(FriendRequestAction)
  readonly action: FriendRequestAction;
}

export class sendFriendRequestDto {
  @IsInt()
  readonly toId: number;
}

import { UserState } from '@prisma/client';

export class IBasicUser {
  id: number;
  state: UserState;
  username: string;
  intra_name: string;
  email: string;
  avatar: string;
  score?: number;
  leaderboard_pos?: number;
  _count?: {
    games_win: number;
    games_lose: number;
    games: number;
  };
  inRoomId?: number;
  inGameId?: number;
}

export interface IIntraUser {
  readonly email: string;
  readonly intra_name: string;
  readonly intra_id: number;
  readonly avatar: string;
  readonly username: string;
}

export class IUserInfo {
  id: number;
  state: UserState;
  username: string;
  intra_name: string;
  email: string;
  avatar: string;
  friends: IBasicUser[];
  blockedUsers: IBasicUser[];
  games: any[];
  score: number;
  leaderboard_pos?: number;
  _count: {
    games_win: number;
    games_lose: number;
    games: number;
  };
  TFAEnabled: boolean;
}

export interface IDataPlayer {
  id: number;
  username: string;
  intra_name?: string;
}

export interface GameUser {
  id: number;
  username: string;
  avatar: string;
  rank?: number;
}

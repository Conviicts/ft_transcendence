import { PenalityType } from '@prisma/client';

export interface IEjectRoom {
  roomId: number;
  targetId: number;
}

export interface IPunish {
  type: PenalityType;
  perm: boolean;
  time: number;
  targetId: number;
  roomId: number;
}

export interface BlockedUser {
  block: boolean;
  userId: number;
}

export interface IPromoteUser {
  roomId: number;
  targetId: number;
}

export interface IDemoteUser {
  roomId: number;
  targetId: number;
}

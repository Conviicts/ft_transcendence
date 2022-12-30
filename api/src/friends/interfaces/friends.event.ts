import { IBasicUser } from 'src/user/interfaces/user.interface';

export interface RequestEvent {
  user: IBasicUser;
  target: IBasicUser;
  success: boolean;
  message?: string;
}

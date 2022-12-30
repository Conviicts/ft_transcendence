import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IBasicUser } from 'src/user/interfaces/user.interface';

export class CreateChatDto {
  @MaxLength(15)
  @MinLength(3)
  @IsString()
  name: string;

  @MaxLength(120)
  @IsString()
  description?: string;

  @IsArray()
  @IsNotEmpty()
  users: IBasicUser[];

  @IsBoolean()
  public: boolean;

  password?: string;
}

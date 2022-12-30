import {
  IsBoolean,
  IsEmail,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createUserDto {
  readonly email: string;
  readonly username: string;
  readonly description?: string;
  readonly password: string;
}

export class createIntraUserDto {
  readonly email: string;
  readonly intra_name: string;
  readonly intra_id: number;
  readonly avatar: string;
  readonly username: string;
}

export class updateUserDto {
  @IsEmail()
  readonly email?: string;

  @MinLength(3)
  @MaxLength(10)
  @IsString()
  @Matches('^[a-zA-Z\\s]+$', undefined, { each: true })
  readonly username?: string;

  @IsUrl()
  readonly avatar?: string;

  @IsBoolean()
  readonly TFAEnabled?: boolean;
}

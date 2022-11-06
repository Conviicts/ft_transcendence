import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsAlphanumeric,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewUserDTO {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @IsAlphanumeric()
  @ApiProperty({ description: 'your username' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'your email' })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'your password' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'your password confirmation' })
  passwordConfirm: string;
}

export class LoginUserDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'your username' })
  id: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'your password' })
  password: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @MinLength(3)
  @MaxLength(15)
  @ApiProperty()
  @IsAlphanumeric()
  username: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty()
  password: string;
}

export class User42DTO {
  username: string;
  password: string;
  email: string;
  login42: string;
}

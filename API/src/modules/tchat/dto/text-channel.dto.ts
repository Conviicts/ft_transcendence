import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TextChannelDTO {
  @IsNotEmpty()
  @ApiProperty({ description: '' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: '' })
  public: boolean;

  @IsNotEmpty()
  @ApiProperty({ description: '' })
  password: string;
}

export class GetTextChannelDTO {
  @IsNotEmpty()
  @ApiProperty({ description: '' })
  id: string;

  @IsNotEmpty()
  @ApiProperty({ description: '' })
  needPass: boolean;
}

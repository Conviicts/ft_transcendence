export class BasicLoginDto {
  email: string;
  password: string;
}

export class TFALoginDto {
  TFACode: string;
}

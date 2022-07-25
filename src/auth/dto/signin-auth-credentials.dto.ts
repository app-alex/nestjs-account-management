import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInAuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

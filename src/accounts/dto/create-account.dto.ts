import { Application } from '../../applications/application.entity';

export class CreateAccountDto {
  username: string;

  email: string;

  password: string;

  application: Application;
}

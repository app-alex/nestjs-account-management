import { IsNotEmpty } from 'class-validator';

export class InsertApplicationIconPathDto {
  @IsNotEmpty()
  iconPath: string;
}

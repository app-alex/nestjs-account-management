import { IsNotEmpty } from "class-validator";

export class InsertApplicationDto {
    @IsNotEmpty()
    name: string;
}
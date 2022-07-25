import { Application } from "../../applications/application.entity";

export class ModifyAccountDto {
    application?: Application;
    username?: string;
    email?: string;
    password?: string;
}
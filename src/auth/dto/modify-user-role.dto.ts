import { IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class ModifyUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

import { SetMetadata } from '@nestjs/common';
import { UserRole } from './user-role.enum';

export const Role = (role: UserRole) => SetMetadata('role', role);

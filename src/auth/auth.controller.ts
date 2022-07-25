import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpAuthCredentialsDto } from './dto/signup-auth-credentials.dto';
import { SignInAuthCredentialsDto } from './dto/signin-auth-credentials.dto';
import { Role } from './role.decorator';
import { RoleGuard } from './role.guard';
import { UserRole } from './user-role.enum';
import { ModifyUserRoleDto } from './dto/modify-user-role.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: SignUpAuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: SignInAuthCredentialsDto,
  ): Promise<{ accessToken: string; tokenExpirationDate: number }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role(UserRole.ADMIN)
  getUsers() {
    return this.authService.getUsers();
  }

  @Get('/accounts')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role(UserRole.ADMIN)
  getUsersApplications() {
    return this.authService.getUsersAccounts();
  }

  @Patch('/modify/role/:id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role(UserRole.ADMIN)
  modifyUserRole(
    @Param('id') id: string,
    @Body() modifyUserRoleDto: ModifyUserRoleDto,
  ) {
    return this.authService.modifyUserRole(id, modifyUserRoleDto);
  }
}

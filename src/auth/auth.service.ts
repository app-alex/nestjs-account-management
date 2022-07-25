import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpAuthCredentialsDto } from './dto/signup-auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { SignInAuthCredentialsDto } from './dto/signin-auth-credentials.dto';
import { ModifyUserRoleDto } from './dto/modify-user-role.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialsDto: SignUpAuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: SignInAuthCredentialsDto,
  ): Promise<{ accessToken: string; tokenExpirationDate: number }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });
    const role = user.role;

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username, role };
      const accessToken = this.jwtService.sign(payload);
      const tokenExpirationDate = new Date().getTime() + 3600 * 1000;

      return { accessToken, tokenExpirationDate };
    } else {
      throw new UnauthorizedException('Wrong credentials');
    }
  }

  getUsers() {
    return this.userRepository.getUsers();
  }

  getUsersAccounts() {
    return this.userRepository.getUsersAccounts();
  }

  modifyUserRole(id: string, modifyUserRoleDto: ModifyUserRoleDto) {
    return this.userRepository.modifyUserRole(id, modifyUserRoleDto);
  }
}

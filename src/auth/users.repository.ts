import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SignUpAuthCredentialsDto } from './dto/signup-auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user-role.enum';
import { ModifyUserRoleDto } from './dto/modify-user-role.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(
    authCredentialsDto: SignUpAuthCredentialsDto,
  ): Promise<void> {
    const { username, password, role } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
      role,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUsers(): Promise<User[]> {
    const query = this.createQueryBuilder('user');

    const users = await query.getMany();

    return users;
  }

  async getUsersAccounts() {
    const query = this.createQueryBuilder('user');

    query.leftJoinAndSelect('user.accounts', 'accounts');
    query.leftJoinAndSelect('accounts.application', 'application');

    const users = await query.getMany();

    return users;
  }

  async modifyUserRole(id: string, modifyUserRoleDto: ModifyUserRoleDto) {
    const { role } = modifyUserRoleDto;
    const user = await this.findOne(id);

    user.role = role;
    this.save(user);

    return user;
  }
}

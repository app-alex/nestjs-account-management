import { NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetAccountsFilterDto } from './dto/get-accounts-filter.dto';
import { ModifyAccountDto } from './dto/modify-account.dto';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async getAccounts(
    getAccountsFilterDto: GetAccountsFilterDto,
    user: User,
  ): Promise<Account[]> {
    const { search } = getAccountsFilterDto;

    const query = this.createQueryBuilder('account');

    query.where({ user });

    if (search) {
      query.andWhere('(LOWER(account.application) LIKE(:search))', {
        search: `%${search}%`,
      });
    }

    query.leftJoinAndSelect('account.application', 'application');

    const accounts = await query.getMany();

    return accounts;
  }

  async getAccountById(id: string, user: User): Promise<Account> {
    const account = await this.findOne({ id, user });

    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }

    return account;
  }

  async createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
  ): Promise<Account> {
    const { username, email, password, application } = createAccountDto;

    const account = this.create({
      username,
      email,
      password,
      user,
      application,
    });

    await this.save(account);

    return account;
  }

  async deleteAccount(id: string, user: User): Promise<void> {
    const account = await this.delete({ id, user });

    if (account.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async modifyAccount(
    id: string,
    modifyAccountDto: ModifyAccountDto,
    user: User,
  ): Promise<Account> {
    const { username, email, password, application } = modifyAccountDto;

    const account = await this.getAccountById(id, user);

    if (username) {
      account.username = username;
    }

    if (email) {
      account.email = email;
    }

    if (password) {
      account.password = password;
    }

    if (application) {
      account.application = application;
    }

    await this.save(account);

    return account;
  }
}

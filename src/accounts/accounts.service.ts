import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Account } from './account.entity';
import { AccountsRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetAccountsFilterDto } from './dto/get-accounts-filter.dto';
import { ModifyAccountDto } from './dto/modify-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
  ) {}

  getAccounts(getAccountsFilterDto: GetAccountsFilterDto, user: User) {
    return this.accountsRepository.getAccounts(getAccountsFilterDto, user);
  }

  getAccountById(id: string, user: User): Promise<Account> {
    return this.accountsRepository.getAccountById(id, user);
  }

  createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
  ): Promise<Account> {
    return this.accountsRepository.createAccount(createAccountDto, user);
  }

  deleteAccount(id: string, user: User): Promise<void> {
    return this.accountsRepository.deleteAccount(id, user);
  }

  modifyAccount(
    id: string,
    modifyAccountDto: ModifyAccountDto,
    user: User,
  ): Promise<Account> {
    return this.accountsRepository.modifyAccount(id, modifyAccountDto, user);
  }
}

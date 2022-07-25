import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetAccountsFilterDto } from './dto/get-accounts-filter.dto';
import { ModifyAccountDto } from './dto/modify-account.dto';

@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  getAccounts(
    @Query() getAccountsFilterDto: GetAccountsFilterDto,
    @GetUser() user: User,
  ): Promise<Account[]> {
    return this.accountsService.getAccounts(getAccountsFilterDto, user);
  }

  @Get('/:id')
  getAccountById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Account> {
    return this.accountsService.getAccountById(id, user);
  }

  @Post()
  createAccount(
    @Body() createAccountDto: CreateAccountDto,
    @GetUser() user: User,
  ): Promise<Account> {
    return this.accountsService.createAccount(createAccountDto, user);
  }

  @Delete('/:id')
  deleteAccount(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.accountsService.deleteAccount(id, user);
  }

  @Patch('/:id')
  modifyAccount(
    @Param('id') id: string,
    @Body() modifyAccountDto: ModifyAccountDto,
    @GetUser() user: User,
  ) {
    return this.accountsService.modifyAccount(id, modifyAccountDto, user);
  }
}

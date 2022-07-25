import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRole } from '../auth/user-role.enum';
import { Account } from './account.entity';
import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  let accountsService: AccountsService;
  let accountsRepository;

  const mockAccountsRepository = () => ({
    getAccounts: jest.fn(() => []),
    getAccountById: jest.fn(),
  });

  const mockUser = {
    id: 'someId',
    username: 'someUsername',
    password: 'somePassword',
    role: UserRole.STANDARD,
    accounts: [],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: AccountsRepository, useFactory: mockAccountsRepository },
      ],
    }).compile();

    accountsService = module.get(AccountsService);
    accountsRepository = module.get(AccountsRepository);
  });

  describe('getAccounts', () => {
    it('calls AccountsRepository.getAccounts and returns the result', async () => {
      const result = await accountsService.getAccounts(null, mockUser);
      expect(result).toEqual([]);
    });
  });

  it('should be defined', () => {
    expect(accountsService).toBeDefined();
  });

  describe('getAccountById', () => {
    it('calls AccountsRepository.getAccountById and returns the result', async () => {
      const mockAccount = {
        id: 'someId',
        username: 'someUsername',
        password: 'somePassword',
        application: null,
      };

      accountsRepository.getAccountById.mockResolvedValue(mockAccount);
      const result = await accountsService.getAccountById('someId', mockUser);
      expect(result).toEqual(mockAccount);
    });

    it('calls AccountsRepository.getAccountById and handles an error', async () => {
      try {
        accountsRepository.getAccountById.mockImplementation(() => {
          throw new NotFoundException();
        });
        const result = accountsService.getAccountById('someId', mockUser);
      } catch (error) {
        expect(error).toEqual(new NotFoundException());
      }
    });
  });
});

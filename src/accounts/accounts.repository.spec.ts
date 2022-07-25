import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../auth/user-role.enum';
import { AccountsRepository } from './accounts.repository';

describe('AccountsRepository', () => {
  let accountsRepository: AccountsRepository;

  const mockUser = {
    id: 'someId',
    username: 'someUsername',
    password: 'somePassword',
    role: UserRole.STANDARD,
    accounts: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsRepository],
    }).compile();

    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(accountsRepository).toBeDefined();
  });
});

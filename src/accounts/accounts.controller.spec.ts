import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../auth/user-role.enum';
import { AccountsController } from './accounts.controller';
import { AccountsModule } from './accounts.module';
import { AccountsService } from './accounts.service';

describe('AccountsController', () => {
  let accountsController: AccountsModule;
  let accountsService;

  const mockAccountsservice = () => ({
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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: AccountsService, useFactory: mockAccountsservice },
      ],
    }).compile();

    accountsController = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(accountsController).toBeDefined();
  });

  it('should ensure the JwtAuthGuard is applied to the controller', async () => {
    const guards = Reflect.getMetadata('__guards__', AccountsController);
    const guard = new guards[0]();
    expect(guard).toBeInstanceOf(AuthGuard('jwt'));
  });

  describe('getAccounts', () => {
    it('calls AccountsService.getAccounts and returns the result', async () => {
      const result = await accountsService.getAccounts(null, mockUser);
      expect(result).toEqual([]);
    });
  });
});

import { Test } from '@nestjs/testing';
import { UserRole } from '../auth/user-role.enum';
import { Application } from './application.entity';
import { ApplicationsRepository } from './applications.repository';
import { ApplicationsService } from './applications.service';
import { InsertApplicationIconPathDto } from './dto/inser-application-icon-path.dto';
import { InsertApplicationDto } from './dto/insert-application.dto';

describe('ApplicationsService', () => {
  let applicationsService: ApplicationsService;
  let applicationRepository;

  const mockApplicationsRepository = () => ({
    insertApplication: jest.fn(
      (insertApplicationDto: InsertApplicationDto): Application => {
        const application: Application = {
          id: 'someId',
          name: insertApplicationDto.name,
          iconPath: null,
          accounts: [],
        };
        return application;
      },
    ),
    insertApplicationIconPath: jest.fn(
      (
        id: string,
        insertApplicationIconPathDto: InsertApplicationIconPathDto,
      ) => {
        const application: Application = {
          id,
          name: 'someAppName',
          iconPath: insertApplicationIconPathDto.iconPath,
          accounts: [],
        };
        return application;
      },
    ),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: ApplicationsRepository,
          useFactory: mockApplicationsRepository,
        },
      ],
    }).compile();

    applicationsService = module.get(ApplicationsService);
    applicationRepository = module.get(ApplicationsRepository);
  });

  it('should be defined', () => {
    expect(applicationsService).toBeDefined();
  });

  describe('insertApplication', () => {
    const someInsertApplicationDto: InsertApplicationDto = {
      name: 'someApplication',
    };

    it('calls ApplicationsService.insertApplication and returns the result', () => {
      expect(
        applicationsService.insertApplication(someInsertApplicationDto),
      ).toEqual({
        id: 'someId',
        name: someInsertApplicationDto.name,
        iconPath: null,
        accounts: [],
      });
    });
  });

  describe('insertApplicationIconPath', () => {
    const someInsertApplicationIconPathDto: InsertApplicationIconPathDto = {
      iconPath: 'somePath',
    };
    const mockId = 'mockId';

    it('calls ApplicationsService.insertApplicationIconPath and returns the result', () => {
      expect(
        applicationsService.insertApplicationIconPath(
            mockId,
          someInsertApplicationIconPathDto,
        ),
      ).toEqual({
        id: mockId,
        name: 'someAppName',
        iconPath: someInsertApplicationIconPathDto.iconPath,
        accounts: [],
      });
    });
  });
});

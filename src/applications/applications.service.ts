import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationsRepository } from './applications.repository';
import { InsertApplicationIconPathDto } from './dto/inser-application-icon-path.dto';
import { InsertApplicationDto } from './dto/insert-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(ApplicationsRepository)
    private applicationRepository: ApplicationsRepository,
  ) {}

  getApplications() {
    return this.applicationRepository.getApplications();
  }
  getApplicationById(id: string) {
    return this.applicationRepository.getApplicationById(id);
  }

  insertApplication(
    insertApplicationDto: InsertApplicationDto,
  ): Promise<Application> {
    return this.applicationRepository.insertApplication(insertApplicationDto);
  }

  insertApplicationIconPath(
    id: string,
    insertApplicationIconPathDto: InsertApplicationIconPathDto,
  ) {
    return this.applicationRepository.insertApplicationIconPath(
      id,
      insertApplicationIconPathDto,
    );
  }

  removeApplication(id: string): Promise<void> {
    return this.applicationRepository.removeApplication(id);
  }
}

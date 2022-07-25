import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { application } from 'express';
import { EntityRepository, Repository } from 'typeorm';
import { Application } from './application.entity';
import { InsertApplicationIconPathDto } from './dto/inser-application-icon-path.dto';
import { InsertApplicationDto } from './dto/insert-application.dto';
import * as fs from 'fs';

@EntityRepository(Application)
export class ApplicationsRepository extends Repository<Application> {
  async getApplications(): Promise<Application[]> {
    const query = this.createQueryBuilder('application');

    const applications = await query.getMany();
    return applications;
  }

  async getApplicationById(id: string) {
    const application = await this.findOne(id);

    if (!application) {
      throw new NotFoundException(`Application with ID "${id}" not found`);
    }

    return application;
  }

  async insertApplication(
    insertApplicationDto: InsertApplicationDto,
  ): Promise<Application> {
    const { name } = insertApplicationDto;

    const application = this.create({
      name,
    });

    try {
      await this.save(application);
      return application;
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Application already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return application;
  }

  async removeApplication(id: string): Promise<void> {
    const application = await this.getApplicationById(id);

    await this.remove(application);

    if (application.iconPath) {
      await fs.unlink('./' + application.iconPath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }

  async insertApplicationIconPath(
    id: string,
    insertApplicationIconPathDto: InsertApplicationIconPathDto,
  ): Promise<Application> {
    const { iconPath } = insertApplicationIconPathDto;

    const application = await this.getApplicationById(id);

    if (application.iconPath) {
      await fs.unlink('./' + application.iconPath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    application.iconPath = iconPath;

    await this.save(application);

    return application;
  }
}

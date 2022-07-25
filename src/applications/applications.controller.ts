import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { UserRole } from '../auth/user-role.enum';
import { Application } from './application.entity';
import { ApplicationsService } from './applications.service';
import { InsertApplicationDto } from './dto/insert-application.dto';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import path = require('path');
import { createReadStream } from 'fs';

export const storage = {
  storage: diskStorage({
    destination: './icons',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationService: ApplicationsService) {}

  @Get()
  @UseGuards(AuthGuard())
  getApplications() {
    return this.applicationService.getApplications();
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  getApplicationById(id: string) {
    return this.applicationService.getApplicationById(id);
  }

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRole.ADMIN)
  insertApplication(
    @Body() insertApplicationDto: InsertApplicationDto,
  ): Promise<Application> {
    return this.applicationService.insertApplication(insertApplicationDto);
  }

  @Post('/upload/icon/:id')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('icon', storage))
  uploadIcon(@Param('id') id: string, @UploadedFile() icon) {
    const iconPath: string = icon.path;
    const insertApplicationIconPathDto = { iconPath };
    return this.applicationService.insertApplicationIconPath(
      id,
      insertApplicationIconPathDto,
    );
  }

  @Get('/icon/:id')
  async getApplicationIcon(@Param('id') id: string, @Res() res) {
    const application = await this.applicationService.getApplicationById(id);
    const data = createReadStream(
      path.join(process.cwd(), application.iconPath),
    );
    data.pipe(res);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRole.ADMIN)
  removeApplication(@Param('id') id: string): Promise<void> {
    return this.applicationService.removeApplication(id);
  }
}

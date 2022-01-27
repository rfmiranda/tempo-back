import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoreService } from '../service/core.service';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.coreService.processarFile(file);
  }

  @Get('query/:tipo/:opt?')
  @HttpCode(HttpStatus.OK)
  query(@Param() tipo, @Body() query) {
    return this.coreService.query(query, tipo);
  }

  @Post('query/:tipo/:opt?')
  @HttpCode(HttpStatus.OK)
  postQuery(@Param() tipo, @Body() query) {
    return this.coreService.query(query, tipo);
  }

  @Get('version')
  @HttpCode(HttpStatus.OK)
  version() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      app_name: require('../../../package.json').name,
      node_env: process.env.NODE_ENV,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      version: require('../../../package.json').version,
    };
  }
}

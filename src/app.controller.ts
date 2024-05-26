import { Controller, Get } from '@nestjs/common';
import { DbService } from './config';

@Controller()
export class AppController {
  constructor(private readonly dbService: DbService) {}

  // prisma test
  @Get()
  async getHello() {
    return await this.dbService.photo.findMany();
  }
}

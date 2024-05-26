import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule, EnvConfigModule } from './config';
import { PhotoModule } from './modules';

@Module({
  imports: [DbModule, EnvConfigModule, PhotoModule],
  controllers: [AppController],
})
export class AppModule {}

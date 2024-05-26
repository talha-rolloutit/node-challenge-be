import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule, EnvConfigModule } from './config';

@Module({
  imports: [DbModule, EnvConfigModule],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { FlickrService } from './flickr.service';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [PhotoController],
  providers: [FlickrService, PhotoService],
  exports: [FlickrService, PhotoService],
})
export class PhotoModule {}

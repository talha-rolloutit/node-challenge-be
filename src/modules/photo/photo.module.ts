import { Module } from '@nestjs/common';
import { FlickrService } from './flickr.service';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  controllers: [PhotoController],
  providers: [FlickrService, PhotoService],
  exports: [FlickrService],
})
export class PhotoModule {}

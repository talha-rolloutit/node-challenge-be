import { Module } from '@nestjs/common';
import { FlickrService } from './flickr.service';
import { PhotoController } from './photo.controller';

@Module({
  controllers: [PhotoController],
  providers: [FlickrService],
  exports: [FlickrService],
})
export class PhotoModule {}

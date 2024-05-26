import { Body, Controller, Get, Post } from '@nestjs/common';
import { FlickrService } from './flickr.service';
import { PhotoService } from './photo.service';
import { Prisma } from '@prisma/client';

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly flickerService: FlickrService,
    private readonly photoService: PhotoService,
  ) {}

  @Get('flickr')
  async searchCatPhotos() {
    const { page, limit } = { page: '1', limit: '10' };
    const searchImgs = await this.flickerService.searchCatPhotos(page, limit);
    return await this.flickerService.getPhotoInfo(
      searchImgs.photos.photo[0].id,
    );
  }
  @Post()
  async create(@Body() createPhotoDto: Prisma.PhotoCreateInput) {
    const data = await this.photoService.create(createPhotoDto);
    return data;
  }
}

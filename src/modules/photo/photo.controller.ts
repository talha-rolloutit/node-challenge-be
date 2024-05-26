import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Prisma } from '@prisma/client';
import { FindPhotosDto } from './dto/find-photo.dto';
import { FlickrService } from './flickr.service';

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly flickrService: FlickrService,
  ) {}

  @Get('flickr')
  async searchCatPhotos() {
    const { page, limit } = { page: '1', limit: '10' };
    const searchImgs = await this.flickrService.searchCatPhotos(page, limit);
    return await this.flickrService.getPhotoInfo(searchImgs.photos.photo[0].id);
  }
  @Post()
  async create(@Body() createPhotoDto: Prisma.PhotoCreateInput) {
    const data = await this.photoService.create(createPhotoDto);
    return data;
  }
  @Get('top-tags')
  async findTopTags() {
    const data = await this.photoService.getTopTags();
    return data;
  }

  @Get()
  async findAll(@Query() query: FindPhotosDto) {
    const { page, limit, tagId } = query;
    if (tagId) {
      return this.photoService.findTagPhotos(tagId, page, limit);
    } else {
      return this.photoService.findAll(page, limit);
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.photoService.delete(id);
  }
}

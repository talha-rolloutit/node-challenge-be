import { Controller, Get } from '@nestjs/common';
import { FlickrService } from './flickr.service';

@Controller('photo')
export class PhotoController {
  constructor(private readonly flickerService: FlickrService) {}

  @Get('flickr')
  async searchCatPhotos() {
    const { page, limit } = { page: '1', limit: '10' };
    const searchImgs = await this.flickerService.searchCatPhotos(page, limit);
    return await this.flickerService.getPhotoInfo(
      searchImgs.photos.photo[0].id,
    );
  }
}

import { Module, OnModuleInit } from '@nestjs/common';
import { DbModule, EnvConfigModule } from './config';
import { FlickrService, PhotoModule } from './modules';
import { PhotoService } from './modules/photo/photo.service';

@Module({
  imports: [DbModule, EnvConfigModule, PhotoModule],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly photoService: PhotoService,
    private readonly flickrService: FlickrService,
  ) {}
  async onModuleInit() {
    if ((await this.photoService.count()) == 0) {
      const photosPerPage = 50;
      const totalPhotos = 500;
      const failedPhotoIds = [];

      try {
        let page = 1;
        let fetchedPhotos = 0;

        while (fetchedPhotos < totalPhotos) {
          try {
            const flickrCats = await this.flickrService.searchCatPhotos(
              `${page}`,
              `${photosPerPage}`,
            );

            const photos = flickrCats.photos.photo;
            if (photos.length === 0) break;

            const createImgs = [];
            for (const photo of photos) {
              createImgs.push(this.retryFetchPhotoInfo(photo.id));
            }

            const res = await Promise.all(createImgs);
            console.log(`Batch ${page}  done`);

            for (const photoInfo of res) {
              try {
                await this.photoService.create(photoInfo);
              } catch (photoError) {
                console.log(
                  `Error inserting photo ID ${photoInfo.id}:`,
                  photoError,
                );
                failedPhotoIds.push(photoInfo.id);
              }
            }

            fetchedPhotos += photos.length;
          } catch (batchError) {
            console.log(`Error processing batch ${page}:`, batchError);
          }

          page++;
        }

        if (failedPhotoIds.length > 0) {
          console.log(
            `Failed to store the following photo IDs: ${failedPhotoIds.join(', ')}`,
          );
        } else {
          console.log('All photos processed successfully.');
        }
        console.log(await this.photoService.count());
      } catch (error) {
        console.log('Error fetching cat photos:', error);
      }
    }
  }

  async retryFetchPhotoInfo(photoId: string, retries = 5): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const photoInfo = await this.flickrService.getPhotoInfo(photoId);
        return photoInfo;
      } catch (error) {
        console.log(
          `Attempt ${attempt} failed for photo ID ${photoId}:`,
          error,
        );
        if (attempt === retries) {
          console.log(
            `Failed to fetch photo ID ${photoId} after ${retries} attempts.`,
          );
          throw error;
        }
        await this.delay(1000);
      }
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

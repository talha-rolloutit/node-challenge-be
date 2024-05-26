import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  get appPort(): number {
    return parseInt(this.configService.get<string>('App.port'));
  }
  get appEnv(): any {
    return this.configService.get<string>('App.env');
  }
  get flickrApiKey(): string {
    return this.configService.get<string>('Flickr.apiKey');
  }

  get flickrApiSecret(): string {
    return this.configService.get<string>('Flickr.apiSecret');
  }
  get dbUrl(): string {
    return this.configService.get<string>('Db.url');
  }
}

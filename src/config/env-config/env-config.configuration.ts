import { registerAs } from '@nestjs/config';

export enum EnvConfigKey {
  App = 'App',
  Db = 'Db',
  Flickr = 'Flickr',
}

export enum Environment {
  local = 'local',
  development = 'development',
  staging = 'staging',
  production = 'production',
  testing = 'testing',
}

const appConfig = registerAs(EnvConfigKey.App, () => ({
  env:
    Environment[process.env.NODE_ENV as keyof typeof Environment] ||
    Environment.development,
  port: Number(process.env.PORT) || 3000,
}));

const dbConfig = registerAs(EnvConfigKey.Db, () => ({
  url: process.env.DATABASE_URL,
}));
const flickrConfig = registerAs(EnvConfigKey.Flickr, () => ({
  apiKey: process.env.FLICKER_API_KEY,
  apiSecret: process.env.FLICKER_API_SECRET,
}));

export const configurations = [appConfig, dbConfig, flickrConfig];

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService, Environment } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvConfigService);
  app.enableCors();
  app.setGlobalPrefix('api');
  if (configService.appEnv !== Environment.production) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Node Challenge')
      .addCookieAuth()
      .setDescription('Node Challenge API Services')
      .setExternalDoc('Postman Collection', '/api-json')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  console.log('port ', configService.appPort);
  await app.listen(configService.appPort);
}
bootstrap();

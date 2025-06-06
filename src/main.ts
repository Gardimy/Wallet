import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import chalk from 'chalk';
import { VersioningType } from '@nestjs/common';
// import chalk from 'chalk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Set global prefix for all routes
  app.enableVersioning({
    type: VersioningType.URI, // Enable versioning via URI
    defaultVersion: '1', // Default version
  }); // Enable CORS for all origins
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Wallet API')
    .setDescription('API for wallet creation and transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger available at /api

  await app.listen(3000);
  console.log(chalk.green('Server is running on http://localhost:3000'));
}
bootstrap();

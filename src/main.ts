import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ClassSerializerInterceptor, LogLevel } from '@nestjs/common';
import { LoggerInterceptor } from './logger.interceptor';

async function bootstrap() {

  const isProduction = process.env.NODE_ENV === 'production';
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'verbose', 'debug'];
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  app.enableCors();
  app.setGlobalPrefix('/api')
  app.use(bodyParser.json({ limit: '2mb' }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new LoggerInterceptor());
  /**
   * @param port - port on which app will be run
   */
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
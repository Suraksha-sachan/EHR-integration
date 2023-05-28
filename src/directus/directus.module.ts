import { Module } from '@nestjs/common';
import { DirectusService } from './directus.service';

@Module({
  controllers: [],
  providers: [DirectusService]
})
export class DirectusModule {}

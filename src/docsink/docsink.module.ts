import { Module } from '@nestjs/common';
import { DocsinkService } from './docsink.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [DocsinkService],

})
export class DocsinkModule {}

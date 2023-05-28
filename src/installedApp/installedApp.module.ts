import { Module } from '@nestjs/common';
import { InstalledAppService } from './installedApp.service';
import { InstalledAppController } from './installedApp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotTokens } from './entities/botTokens.entity';
import { AppSubmissions } from './entities/appSubmissions.entity';
import { Apps } from './entities/apps.entity';
import { AppCategories } from './entities/appCategories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BotTokens,AppSubmissions,Apps,AppCategories])],
  controllers: [InstalledAppController],
  providers: [InstalledAppService]
})
export class InstalledAppModule {}

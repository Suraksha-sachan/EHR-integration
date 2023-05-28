import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { BotInstallationService } from './eventsServices/botInstallation.service';
import { HttpModule } from '@nestjs/axios';
import { NewBotInstallService } from './eventsServices/newBotinstall.service';
import { BotUninstallService } from './eventsServices/botreinstall.service';
import { DexcomLogservice } from 'src/middleware/dexcom.logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DexcomLogs } from 'src/middleware/dexcom.logs.entity';

@Module({
  imports : [HttpModule,TypeOrmModule.forFeature([DexcomLogs], process.env.BOTS_CONNECTION_NAME)],
  controllers: [BotsController],
  providers: [BotsService,BotInstallationService,NewBotInstallService,BotUninstallService,DexcomLogservice]
})
export class BotsModule {}

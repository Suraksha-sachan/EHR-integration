import { Module } from '@nestjs/common';
import { DexcomService } from './dexcom.service';
import { DexcomController } from './dexcom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dexcom } from './dexcom.entity';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { TasksService } from './dexcom.readings.cron';
import { Metrics } from './metrics.entity';
import { TokenRefreshService } from './dexcom.refreshToken.cron';
import { DexcomLogservice } from 'src/middleware/dexcom.logs.service';
import { DexcomLogs } from 'src/middleware/dexcom.logs.entity';
import { DocsinkService } from './docsink/docsink.service';
import { DocsinkOrganization } from './docsink/docsink.organization.entity';
import { DocsinkPatient } from './docsink/docsink.patient.entity';
import { DexcomConfigurationService } from './dexcomConfiguration/dexcomConfiguration.service';
import { DexcomConfiguration } from './dexcomConfiguration/dexcomConfiguration.entity';
import { dexcomEgvsService } from './dexcomEgvs/dexcomEgvs.service';
import { HistoricalService } from './historicalReading/historical.service';
import { OnPatientSyncHistoricalService } from './historicalReading/historicalReading.service';
import { DeleteLogsService } from 'src/middleware/dexcom.logs.cron';

@Module({
  imports: [TypeOrmModule.forFeature([Dexcom], process.env.BOTS_CONNECTION_NAME),
  TypeOrmModule.forFeature([Metrics], process.env.BOTS_CONNECTION_NAME),
  TypeOrmModule.forFeature([DexcomLogs], process.env.BOTS_CONNECTION_NAME),
  TypeOrmModule.forFeature([DocsinkOrganization], process.env.BOTS_CONNECTION_NAME),
  TypeOrmModule.forFeature([DocsinkPatient], process.env.BOTS_CONNECTION_NAME),
  TypeOrmModule.forFeature([DexcomConfiguration], process.env.BOTS_CONNECTION_NAME),
  HttpModule,
  HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),
    PassportModule],
  controllers: [DexcomController],
  providers: [DexcomService, TasksService, TokenRefreshService, DexcomLogservice, DocsinkService,DexcomConfigurationService,dexcomEgvsService,OnPatientSyncHistoricalService,HistoricalService , DeleteLogsService]
})
export class DexcomModule { }

import { Module } from '@nestjs/common';
import { AthenaMydataService } from './athena-mydata.service';
import { AthenaMydataController } from './athena-mydata.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { athena_appointment } from './athena_appointment.entity';
import { UpsertAppointmentTypeService, } from './docsink_upsert/upsertAppointmetype.service';
import { UpsertLocationService } from './docsink_upsert/upsertLocation.service';
import { UpsertProviderService } from './docsink_upsert/upsertProvider.service';
import { UpsertOfficeService } from './docsink_upsert/upsertOffice.service';
import { DocsinkUpsertService } from './docsink_upsert/docsinkEntities.cron';
import { TokenManagerService } from './tokenManager/token.cron';
import { RenewAccessTokenService } from './tokenManager/renewAccessToken.service';
import { MydataEntitiesModule } from './mydataEntities/mydataEntities.module';
import { DocsinkService } from 'src/docsink/docsink.service';
import { DirectusService } from 'src/directus/directus.service';


@Module({
  imports: [HttpModule,
    TypeOrmModule.forFeature([athena_appointment], process.env.BOTS_CONNECTION_NAME),
    MydataEntitiesModule],
  controllers: [AthenaMydataController],
  providers: [AthenaMydataService, DocsinkUpsertService,
    UpsertAppointmentTypeService, UpsertLocationService,
    UpsertProviderService, UpsertOfficeService,
    TokenManagerService, RenewAccessTokenService,DocsinkService,DirectusService]
})
export class AthenaMydataModule { }

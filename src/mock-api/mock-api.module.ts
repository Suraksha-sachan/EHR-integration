import { Module } from '@nestjs/common';
import { MockApiService } from './mock-api.service';
import { MockApiController } from './mock-api.controller';
import { OrganizationApiService } from './organization/organization.service';
import { LocationApiService } from './location/location.service';
import { PractitionerApiService } from './practitioner/practitioner.service';
import { PatientApiService } from './patient/patient.service';
import { AppointmentApiService } from './appointment/appointment.service';
import { OauthApiService } from './oauth/oauth.service';
import { ImportAppointmentJobService} from './importAppointment/importAppointment.service';

@Module({
  controllers: [MockApiController],
  providers: [MockApiService,OrganizationApiService, LocationApiService, PractitionerApiService, PatientApiService, AppointmentApiService, OauthApiService,ImportAppointmentJobService]
})
export class MockApiModule {}

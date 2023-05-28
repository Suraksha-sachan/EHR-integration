import { Injectable } from '@nestjs/common';
import { OrganizationApiService } from './organization/organization.service';
import { LocationApiService } from './location/location.service';
import { PractitionerApiService } from './practitioner/practitioner.service';
import { PatientApiService } from './patient/patient.service';
import { AppointmentApiService } from './appointment/appointment.service';
import { OauthApiService } from './oauth/oauth.service';
import { ImportAppointmentJobService } from './importAppointment/importAppointment.service';

@Injectable()
export class MockApiService {
    constructor(
        private readonly organizationApiService: OrganizationApiService,
        private readonly locationApiService: LocationApiService,
        private readonly practitionerApiService: PractitionerApiService,
        private readonly patientApiService: PatientApiService,
        private readonly appointmentApiService: AppointmentApiService,
        private readonly oauthApiService: OauthApiService,
        private readonly importAppointmentJobService:ImportAppointmentJobService
    ) { }

    async getOrganization (count:string){
        if(count){
            return await this.organizationApiService.getNextOrganization();
        }

        else {
            return await this.organizationApiService.getAllOrganization();
        }

    }

    async getLocation (count:string){
        if(count){
            return await this.locationApiService.getNextLocation();
        }

        else {
            return await this.locationApiService.getAllLocation();
        }

    }

    async getPractitioner (count:string){
        if(count){
            return await this.practitionerApiService.getNextPractitioner();
        }

        else {
            return await this.practitionerApiService.getAllPractitioner();
        }

    }

    async getPatient (count:string ,id:string ){
        if(count){
            return await this.patientApiService.getNextPatient();
        }
        else if(id){
            return await this.patientApiService.getPatientById(id);
        }

        else {
            return await this.patientApiService.getAllPatient();
        }

    }

    async getAppointment(count:string){
        if(count){
            return await this.appointmentApiService.getNextAppointment();
        }
        else{
            return await this.appointmentApiService.getAllAppointment();
        }
    }

    async getToken(){

       return await this.oauthApiService.getToken();

    }

    async getImportAppointment(actor:string)
    {
        return await this.importAppointmentJobService.getImportAppointments()

    }
    
}

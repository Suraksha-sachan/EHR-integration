import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MydataServerAdminService } from "./mydataServerAdmin.cron";
import { MydataOrganizationService } from "./organization/mydataOrganization.service";
import { UpsertMydataLocationService } from "./location/mydataLocation.service";
import { SyncDocsinkLocationService } from "./location/syncLocationToDocsink.service";
import { MydataApiIntegrationService } from "./mydata.apiIntegration";
import { MyDataPractitionerService } from "./practitioner/mydataPractitioner.service";
import { SyncPractitionerToDocsinkService } from "./practitioner/syncPractitionerToDocsink.service";
import { MydataEntitiesController } from "./mydataEntities.controller";
import { MydataPatientService } from "./patient/mydataPatient.service";
import { MydataServerDataService } from "./mydataServerData.cron";
import { SyncPatientToDocsinkService } from "./patient/syncPatientsToDocsink.service";
import { MydataAppointmentService } from "./appointment/appointment.service";
import { AppointmentTypeService } from "./appointment/appointmentType/appointmentType.service";
import { SyncDocsinkAppointmentTypeService } from "./appointment/appointmentType/syncAppointmentTypeToDocsink.service";
import { PatientService } from "./appointment/patient/patient.service";
import { SyncAppointmentToDocsinkService } from "./appointment/syncAppointmentToDocsink.service";
import { MydataImportAppointmentService } from "./mydataImportAppointment.cron";
import { MydataImportAppointmentJobService } from "./appointment/importAppointmentJob/importAppointment.service";
import { DocsinkService } from "src/docsink/docsink.service";


@Module({
    imports: [HttpModule],
    controllers: [MydataEntitiesController],
    providers: [
        MydataServerAdminService,
        MydataOrganizationService,
        SyncDocsinkLocationService,
        MydataApiIntegrationService,
        MyDataPractitionerService,
        SyncPractitionerToDocsinkService,
        UpsertMydataLocationService,
        MydataPatientService,
        MydataServerDataService,
        SyncPatientToDocsinkService,
        MydataAppointmentService,
        AppointmentTypeService,
        SyncDocsinkAppointmentTypeService,
        PatientService,
        SyncAppointmentToDocsinkService,
        MydataImportAppointmentService,
        MydataImportAppointmentJobService,
        DocsinkService
    ]
})

export class MydataEntitiesModule { }
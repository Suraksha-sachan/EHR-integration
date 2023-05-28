import { Controller, Get } from "@nestjs/common";
import { MydataServerAdminService } from "./mydataServerAdmin.cron";
import { MydataServerDataService } from "./mydataServerData.cron";
import { MydataImportAppointmentService } from "./mydataImportAppointment.cron";

@Controller('mydata-entities')

export class MydataEntitiesController{
    constructor(
        private readonly mydataServerAdminService : MydataServerAdminService,
        private readonly mydataServerDataService: MydataServerDataService,
        private readonly mydataImportAppointmentService:MydataImportAppointmentService
    ) {}

    @Get('/server-admin-cron')
    async serverAdmin () {
       return await this.mydataServerAdminService.handleCron()
    }

    @Get('/server-data-cron')
    async  serverData() {
        return await this.mydataServerDataService.handleCron()
    }

    @Get('/appointments/import')
    async appointmentData() {
        return await this.mydataImportAppointmentService.handleCron();
    }
}
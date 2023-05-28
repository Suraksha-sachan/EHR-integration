import { Injectable, Logger } from "@nestjs/common";
import { UpsertAppointmentTypeService } from "./upsertAppointmetype.service";
import { BaseService } from "src/abstract";
import { Cron } from "@nestjs/schedule";
import { UpsertLocationService } from "./upsertLocation.service";
import { UpsertProviderService } from "./upsertProvider.service";
import { UpsertOfficeService } from "./upsertOffice.service";
import { DirectusService } from "src/directus/directus.service";

@Injectable()

export class DocsinkUpsertService extends BaseService {

    constructor(
        private readonly appointmenttypeservice: UpsertAppointmentTypeService,
        private readonly locationservice: UpsertLocationService,
        private readonly providerservice: UpsertProviderService,
        private readonly officeservice: UpsertOfficeService,
        private readonly directusService: DirectusService) {
        super();
    }

    private readonly logger = new Logger(DocsinkUpsertService.name);
    @Cron("0 23 * * *")

    async handleCron() {

        try {
            console.log("Cron job started for docsink entities (AppointmentType,Location,Providers,Offices)");

            const myDataConfig = await this.directusService.fetchCollectionFilteredItem("mydata_configuration", "docsink_bot_token,docsink_organization.id", '{"enabled":{"_eq":true}}')
            console.log("configuration response body", myDataConfig?.data);
            const ConfigData = myDataConfig?.data;

            await Promise.all(
                ConfigData.map(async (config) => {
                    const docsinkBotToken = config?.docsink_bot_token;

                    const orgID = config?.docsink_organization.id;

                    if (docsinkBotToken !== '') {

                        await this.appointmenttypeservice.storeAppointmentTypes(orgID, docsinkBotToken)

                        await this.locationservice.storeLocations(orgID, docsinkBotToken);

                        await this.providerservice.storeProviders(orgID, docsinkBotToken);

                        await this.officeservice.storeOffices(orgID, docsinkBotToken);

                        console.log("Org Data cron runs sucesssfully");
                    }
                }));
        } catch (error) {
            console.log("🚀 ~ file: docsinkEntities.cron.ts:66 ~ DocsinkUpsertService ~ handleCron ~ error:", error?.message);
            this._getBadRequestError(error?.message)
        }

    }
}

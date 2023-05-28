import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { MydataOrganizationService, } from "./organization/mydataOrganization.service";
import { UpsertMydataLocationService } from "./location/mydataLocation.service";
import { Cron } from "@nestjs/schedule";
import { MyDataPractitionerService } from "./practitioner/mydataPractitioner.service";
@Injectable()

export class MydataServerAdminService extends BaseService {
    constructor(
        private readonly httpservice: HttpService,
        private readonly organizationservice: MydataOrganizationService,
        private readonly mydatalocationservice: UpsertMydataLocationService,
        private readonly mydatapractitionerservice: MyDataPractitionerService
    ) {
        super()
    }

    @Cron("0 23 * * *")
    async handleCron() {
        try {
            console.log("Cron job started for server admin(organization, location, practitioner)");
            const getOrgConfigs = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_configuration`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: "id,url,api_access_token,docsink_organization.id,docsink_bot_token,default_email_domain",
                    filter: `{"enabled":{"_eq":true}}`,
                },
            });

            console.log("Configuration request body", getOrgConfigs?.config.url);
            console.log("configuration response body",getOrgConfigs.data);

            const configData = getOrgConfigs?.data.data;

            if (configData.length > 0) {
                await Promise.all(
                    configData.map(async (config) => {

                        if (config?.api_access_token) {

                            await this.organizationservice.storeOrganization(config);
                            await this.mydatalocationservice.StoreLocations(config);
                            await this.mydatapractitionerservice.storePractitioner(config);
                            console.log("MydataServerAdmin Cron runs sucessfully");

                        }
                    }));
            }

        } catch (error) {
        console.log("🚀 ~ file: mydataServerAdmin.cron.ts:53 ~ MydataServerAdminService ~ handleCron ~ error:",error.message)

            this._getBadRequestError(error?.message);

        }
    }
}

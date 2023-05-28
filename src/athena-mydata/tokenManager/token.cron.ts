import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { RenewAccessTokenService } from "./renewAccessToken.service";
import moment from "moment";
import { Cron } from "@nestjs/schedule";

@Injectable()

export class TokenManagerService extends BaseService {

    constructor(
        private readonly httpservice: HttpService,
        private readonly renewaccesstokenservice: RenewAccessTokenService
    ) {
        super();
    }
    @Cron("*/10  * * * *")
    async handleCron() {
        try {   
            console.log("Cron job started for token manager");
            const getOrgConfigs = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_configuration`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: "id,enabled,username,password,url,api_access_token_last_updated,docsink_organization.id,docsink_organization.uuid,docsink_organization.name",
                    filter: `{"enabled":{"_eq":true}}`,
                },

            });
            console.log("Configuration request body", getOrgConfigs?.config.url);
            console.log("configuration response body",getOrgConfigs.data);

            const configData = getOrgConfigs?.data.data;

            configData.map(async (config) => {

                const mydataconfigId = config.id;
                const mydataConfigUserName = config?.username;
                const mydataConfigPassword = config?.password;
                const mydataConfigUrl = config?.url;
                const mydataConfigAccessTokenlastupdated = config?.api_access_token_last_updated;

                const currentDate = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss');

                const tokenUpdatedTimeDiff = moment(currentDate).diff(moment(mydataConfigAccessTokenlastupdated), 'minutes');

                if ((mydataConfigAccessTokenlastupdated == null && mydataConfigUserName != null && mydataConfigPassword != null) || ((tokenUpdatedTimeDiff > 5 && mydataConfigUserName != null && mydataConfigPassword != null))) {
                    const mydataApiBasicAuth = Buffer.from(mydataConfigUserName + ':' + mydataConfigPassword, 'utf8').toString('base64');

                    const renewToken = await this.renewaccesstokenservice.renewToken(mydataConfigUrl, mydataApiBasicAuth);

                    const mydataApiaccessToken = renewToken?.accessToken;

                    await this.renewaccesstokenservice.updateToken(mydataconfigId, mydataApiaccessToken);

                    console.log("Token Cron runs sucessfully");

                }

            })

        } catch (error) {
            console.log(`🚀 ~ file: token.cron.ts:66 ~ TokenManagerService ~ handleCron ~ error:  in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error.message)


        }
    }
}        

import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import moment from "moment";
import { BaseService } from "src/abstract";


@Injectable()

export class RenewAccessTokenService extends BaseService {

    constructor(private readonly httpservice: HttpService) {
        super();
    }

    async renewToken(configurl, accesstoken) {
        try {
            let getToken = await this.httpservice.axiosRef.get(`${configurl}/oauth2/token?scope=user/*.*&grant_type=client_credentials`, {

                headers: { Authorization: `Basic ${accesstoken}` },

            });

            return getToken.data;

        } catch (error) {
            console.log(`🚀 ~ file: renewAccessToken.service.ts:26 ~ RenewAccessTokenService ~ renewToken ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors})
            this._getBadRequestError(`Get:${configurl}/oauth2/token api failed.`);
        }

    }

    async updateToken(id, token) {
        try {
            let Data = {
                api_access_token: token,
                api_access_token_last_updated: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss.SSS",)
            }
            await this.httpservice.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_configuration/${id}`,
                Data,
                {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });

        } catch (error) {
            console.log(`🚀 ~ file: renewAccessToken.service.ts:45 ~ RenewAccessTokenService ~ updateToken ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/mydata_configuration/${id} api failed.`);


        }
    }

}
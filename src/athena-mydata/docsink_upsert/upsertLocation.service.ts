import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { DocsinkService } from "src/docsink/docsink.service";
import { docsinkLocationFormat } from "src/utils/mydataLocationToDocsinkFormat";


@Injectable()

export class UpsertLocationService extends BaseService {

    constructor(
        private readonly httpservice: HttpService,
        private readonly docsinkService:DocsinkService ) { super(); }


    async storeLocations(orgid: number,
        token: string) {

        try {

            const orgId = orgid;

            const botToken = token;
            
            const locationsData = await this.docsinkService.retriveLocation(botToken);
            
            await Promise.all(
                locationsData.map(async (locations) => {

                let getLocationData = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_location`, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    params: { filter: `{"docsink_organization":{"_eq":${orgId}},"uuid":{"_eq":${locations.uuid}}}`, }
                });

                const getLocation = getLocationData?.data.data;

                if (getLocation.length == 0) {
                    locations["docsink_organization"] = orgId;

                    await this.createLocations(locations,orgId);
                }

                getLocation.map(async (data) => {
                    const id = data.id;
                    await this.updateLocations(locations,orgId, id);
                })

            }));

        } catch (error) {
            console.log(`🚀 ~ file: upsertLocation.service.ts:51 ~ UpsertLocationService ~ error:   in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }


    async createLocations(locations, docsink_organization) {
        try {
            const docsinkLocationData = await docsinkLocationFormat(locations,docsink_organization);
            await this.httpservice.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_location`,
            docsinkLocationData, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
            })

        } catch (error) {
            console.log(`🚀 ~ file: upsertLocation.service.ts:65 ~ UpsertLocationService ~ createLocations ~ error:   in API call `,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Post:${process.env.BOTS_API_URL}/items/docsink_location api failed.`);
        }
    }


    async updateLocations(locations,docsink_organization, id) {
        try {
            const docsinkLocationData = await docsinkLocationFormat(locations,docsink_organization);
            await this.httpservice.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_location/${id}`,
            docsinkLocationData, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
            });

        } catch (error) {
            console.log(`🚀 ~ file: upsertLocation.service.ts:79 ~ UpsertLocationService ~ updateLocations ~ error:   in API call `,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/docsink_location/${id} api failed.`);

        }
    }


}
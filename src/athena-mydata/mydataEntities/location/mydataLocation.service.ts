import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { SyncDocsinkLocationService } from "./syncLocationToDocsink.service";
import { MydataApiIntegrationService } from "../mydata.apiIntegration";
import { docsinkOrgLocationFormat, mydatalocationDataFormat } from "src/utils/mydataLocationToDocsinkFormat";
import { DocsinkService } from "src/docsink/docsink.service";

@Injectable()

export class UpsertMydataLocationService extends BaseService {
    constructor(
        private readonly httpService: HttpService,
        private readonly syncDocsinklocationService: SyncDocsinkLocationService,
        private readonly mydataApiService: MydataApiIntegrationService,
        private readonly docsinkService:DocsinkService
    ) { super(); }


    async StoreLocations(config) {
        try {

            const mydataConfigUrl = config?.url;
            const mydataToken = config?.api_access_token;
            const mydataConfigId = config?.id;
            const docsinkbotToken = config?.docsink_bot_token;
            const docsink_organization = config?.docsink_organization.id;
            const resourceType = 'location';
            let resourceUuid: number = null;

            let nextURL;
            let nextLink;
            let counter = 0;

            do {
                const locationData = await this.mydataApiService.fetchMydataLocation(mydataConfigUrl, mydataToken, nextURL)
                const resourceData = locationData.data?.entry;

                if (resourceData.length > 0) {
                   await Promise.all(
                    resourceData.map(async (location) => {
                        if (location.resource.resourceType == 'Location') {

                            let botConfig = {
                                mydata_configuration: mydataConfigId,
                                docsink_bot_token: docsinkbotToken,
                                docsink_organization: docsink_organization,
                            };

                            const id = location.resource.id;
                            const getLocation = await this.getMydataLocationById(id, mydataConfigId);

                            if (getLocation.data.length > 0) {
                                botConfig["mydataLocationId"] = getLocation.data[0].id;
                            }

                            const data = await mydatalocationDataFormat(location.resource, botConfig);

                            const locationResponse = await this.createOrUpdateMyDataLocation(data);

                            const locationId = locationResponse?.data.id;

                            botConfig["mydataLocationId"] = locationId;

                            const locationMapping = await this.checkLocationMapping(locationId);

                            botConfig["external_record_mappings"] = [];

                            if (locationMapping.data.length > 0) {
                                resourceUuid = locationMapping.data[0].uuid;
                                botConfig["docsinkLocationId"] = locationMapping.data[0].id;
                                botConfig["external_record_mappings"] = locationMapping.data[0].external_record_mappings;
                            }
                            const payload = await docsinkOrgLocationFormat(locationResponse.data);
                            const saveDocsinkLocation = await this.docsinkService.upsertResource(resourceType,resourceUuid,docsinkbotToken,payload);
                            if(saveDocsinkLocation){
                                await this.syncDocsinklocationService.createOrUpdateDocsinkLocation(saveDocsinkLocation, botConfig);
                            }
                        }
                    }));
                }

                nextLink = locationData.data.link.find(l => l.relation == 'next');
                
                if (nextLink && nextLink.url == nextURL) {
                    break;
                }
                if (nextLink) {
                    nextURL = nextLink.url;
                }
                counter++;
                if (counter == 20) {
                    break;
                }
            } while (nextLink)

        } catch (error) {
            console.log("🚀 ~ file: mydataLocation.service.ts:93 ~ UpsertMydataLocationService ~ StoreLocations ~ error:", error?.message)
            this._getBadRequestError(error?.message);
        }
    }



    async getMydataLocationById(id, mydataConfigId) {
        try {
            const getlocation = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_location`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: `id`,
                    filter: `{"_and":[{"location_id":{"_eq": ${id}}} , {"mydata_configuration":{"_eq":${mydataConfigId}}}]}`
                }
            });
            return getlocation.data;
        } catch (error) {
            console.log(`🚀 ~ file: mydataLocation.service.ts:110 ~ UpsertMydataLocationService ~ getMydataLocationById ~ error:  in API call `,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(`Post:${process.env.BOTS_API_URL}/items/mydata_location api failed.`);

        }
    }



    async createOrUpdateMyDataLocation(data) {
        try {
            const id = data?.id;
            if (id) {
                const updatemydataLocationData = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_location/${id}`, data, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return updatemydataLocationData.data;
            }
            else {
                const createlocation = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/mydata_location`, data, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return createlocation.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: mydataLocation.service.ts:134 ~ UpsertMydataLocationService ~ createOrUpdateMyDataLocation ~ error:  in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)

        }
    }




    async checkLocationMapping(id: number) {
        try {
            const mappingResponse = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_location`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: `external_record_mappings.*,id,uuid,docsink_organization.id`,
                    filter: `{"_and":[{"external_record_mappings" : {"item": { "_eq" : ${id}} , "collection":{"_eq": "mydata_location"}}}]}`
                }
            });
            return mappingResponse.data;
        } catch (error) {
            console.log(`🚀 ~ file: mydataLocation.service.ts:155 ~ UpsertMydataLocationService ~ checkLocationMapping ~ error:  in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }




}


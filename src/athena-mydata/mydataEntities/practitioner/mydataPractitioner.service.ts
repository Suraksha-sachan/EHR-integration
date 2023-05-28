import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { MydataApiIntegrationService } from "../mydata.apiIntegration";
import { HttpService } from "@nestjs/axios";
import { createOrgDocsinkProviderFormats, practitionerDataFormats } from "src/utils/mydataPractionerToDocsinkFormat";
import { SyncPractitionerToDocsinkService } from "./syncPractitionerToDocsink.service";
import { DocsinkService } from "src/docsink/docsink.service";

@Injectable()

export class MyDataPractitionerService extends BaseService {
    constructor(
        private readonly httpservice: HttpService,
        private readonly mydataApiService: MydataApiIntegrationService,
        private readonly syncPractitionerToDocsinkService: SyncPractitionerToDocsinkService,
        private readonly docsinkService: DocsinkService) {
        super();
    }

    async storePractitioner(config: any) {
        try {

            const configUrl = config?.url;
            const apiToken = config?.api_access_token;
            const mydataConfigId: number = config?.id;
            const emailDomain = config?.default_email_domain;
            const docsinkbotToken = config?.docsink_bot_token;
            const docsink_organization = config?.docsink_organization.id;
            const resourceType = 'provider';
            let resourceUuid: number = null;

            let nextURL;
            let nextLink;
            let counter = 0;

            do {
                const getpractitionerData = await this.mydataApiService.fetchMydataPractitioner(configUrl, apiToken, nextURL);
                const practitionerData = getpractitionerData?.data.entry;

                if (practitionerData.length > 0) {
                    await Promise.all(
                        practitionerData.map(async (practitioner) => {

                            if (practitioner.resource.resourceType == 'Practitioner') {

                                let botConfig = {
                                    mydata_configuration: mydataConfigId,
                                    docsink_bot_token: docsinkbotToken,
                                    docsink_organization: docsink_organization,
                                    email_domain: emailDomain
                                };
                                const location_id = practitioner.resource.practitionerRole[0].location[0].reference.split('/')[1];

                                const getLocationData = await this.getMydataLocation(location_id, mydataConfigId);

                                if (getLocationData.data.length > 0) {
                                    botConfig["location_primary"] = getLocationData.data[0].id;
                                }
                                const getPractitionerById = await this.getMydataPractitionerById(practitioner.resource.id, mydataConfigId);

                                if (getPractitionerById.data.length > 0) {
                                    botConfig["mydataPractitionerId"] = getPractitionerById.data[0].id;
                                }

                                const practitionerFormatData = await practitionerDataFormats(practitioner, botConfig);

                                const PractitionerResponse = await this.createOrUpdateMyDataPractitioner(practitionerFormatData);

                                const practitionerId = PractitionerResponse.data.id;
                                botConfig["mydataPractitionerId"] = practitionerId;

                                const practitionerMapping = await this.checkPractitionerMapping(practitionerId);

                                botConfig["external_record_mappings"] = [];

                                if (practitionerMapping.data.length > 0) {
                                    resourceUuid = practitionerMapping.data[0].uuid;
                                    botConfig["docsinkProviderId"] = practitionerMapping.data[0].id;
                                    botConfig["external_record_mappings"] = practitionerMapping.data[0].external_record_mappings;
                                }
                                const payload = await createOrgDocsinkProviderFormats(PractitionerResponse.data, botConfig.email_domain);
                                 const saveDocsinkProvider = await this.docsinkService.upsertResource(resourceType, resourceUuid,docsinkbotToken,payload)
                                if(saveDocsinkProvider){
                                 await this.syncPractitionerToDocsinkService.upsertDocsinkProvider(saveDocsinkProvider.data, botConfig);
                                }              
                            }
                        })
                    )
                }

                nextLink = getpractitionerData.data.link.find(l => l.relation == 'next');

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
            console.log(`🚀 ~ file: mydataPractitioner.service.ts:101 ~ MyDataPractitionerService ~ storePractitioner ~ error:  in API call `,error?.message);
            this._getBadRequestError(error?.message)
        }
    }


    async createOrUpdateMyDataPractitioner(data) {
        try {
            const id: number = data?.id;
            if (id) {
                const updatemyDataPractitioner = await this.httpservice.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_practitioner/${id}`,
                    data, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return updatemyDataPractitioner.data;
            }
            else {
                const createPractitioner = await this.httpservice.axiosRef.post(`${process.env.BOTS_API_URL}/items/mydata_practitioner`, data, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return createPractitioner.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: mydataPractitioner.service.ts:124 ~ MyDataPractitionerService ~ createOrUpdateMyDataPractitioner ~ error: in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }

    async getMydataPractitionerById(practitioner_id: string, configId: number) {
        try {
            const getPractitioner = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_practitioner`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    filter: `{"_and":[{"practitioner_id":{"_eq": ${practitioner_id}}} , {"mydata_configuration":{"_eq":${configId}}}]}`
                }
            });
            return getPractitioner.data;

        } catch (error) {
            console.log(`🚀 ~ file: mydataPractitioner.service.ts:139 ~ MyDataPractitionerService ~ getMydataPractitionerById ~ error: in API call `,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }

    async checkPractitionerMapping(id: number) {
        try {
            const mappingResponse = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_provider`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: `external_record_mappings.*,id,uuid,docsink_organization.id`,
                    filter: `{"_and":[{"external_record_mappings" : {"item": { "_eq" : ${id}} , "collection":{"_eq": "mydata_practitioner"}}}]}`
                }
            });
            return mappingResponse.data;

        } catch (error) {
            console.log(`🚀 ~ file: mydataPractitioner.service.ts:157 ~ MyDataPractitionerService ~ checkPractitionerMapping ~ error:  in API call `,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }

    async getMydataLocation(location_id: string, configId: number) {
        try {
            const response = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_location`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: "id",
                    filter: `{"_and":[{"location_id":{"_eq":${location_id}}},{"mydata_configuration":{"_eq":${configId}}}]}`

                },
            });
            return response.data;

        } catch (error) {
            console.log(`🚀 ~ file: mydataPractitioner.service.ts:173 ~ MyDataPractitionerService ~ getMydataLocation ~ error: in API call `,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }

}

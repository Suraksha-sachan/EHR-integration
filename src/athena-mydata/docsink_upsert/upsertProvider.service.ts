import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { DocsinkService } from "src/docsink/docsink.service";
import { upsertDocsinkProviderFormat } from "src/utils/mydataPractionerToDocsinkFormat";

@Injectable()

export class UpsertProviderService extends BaseService {
    constructor(
        private readonly httpservice: HttpService,
        private readonly docsinkService:DocsinkService ) { super(); }

    async storeProviders(orgid: number, token: string) {

        try {

            const orgId = orgid;

            const botToken = token;

          const providersData = await this.docsinkService.retriveProvider(botToken);
        
           await Promise.all(
            providersData.map(async (providers) => {

                const getProviders = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_provider`, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    params: { filter: `{"docsink_organization":{"_eq":${orgid}},"uuid":{"_eq":${providers.uuid}}}`, }
                });

                const GetProviders = getProviders?.data.data;

                if (GetProviders.length == 0) {
                    providers["docsink_organization"] = orgId;
                    await this.createProviders(providers, orgId)

                }

                GetProviders.map(async (data) => {
                    const id = data.id;
                    await this.updateProviders(providers,orgId, id)
                });

            }));

        } catch (error) {
            console.log(`🚀 ~ file: upsertProvider.service.ts:47 ~ UpsertProviderService ~ storeProviders ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }


    async createProviders(providers, docsink_organization) {
        try {
            const docsinkProviderData = await upsertDocsinkProviderFormat(providers, docsink_organization)
            await this.httpservice.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_provider`
                , docsinkProviderData, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
            });

        } catch (error) {
            console.log(`🚀 ~ file: upsertProvider.service.ts:61 ~ UpsertProviderService ~ createProviders ~ error: in API call `,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Post:${process.env.BOTS_API_URL}/items/docsink_provider api failed.`);
        }

    }

    async updateProviders(providers,docsink_organization, id) {
        try {
            const docsinkProviderData = await upsertDocsinkProviderFormat(providers, docsink_organization)
            await this.httpservice.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_provider/${id}`,
            docsinkProviderData, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
            })
        } catch (error) {
            console.log(`🚀 ~ file: upsertProvider.service.ts:74 ~ UpsertProviderService ~ updateProviders ~ error: in API call `,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/docsink_provider/${id} api failed.`);
        }
    }
}
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { BaseService } from 'src/abstract';

@Injectable()
export class DocsinkService extends BaseService {
    constructor(
        private readonly httpService: HttpService
    ) { super() }



    async upsertResource(resourceType: string, resourceUuid: number, botToken: string, data: any) {
        try {
            let path = '';
            switch (resourceType) {
                case 'location':
                    path = '/locations';
                    break;
                case 'provider':
                    path = '/providers';
                    break;
                    default:
                        return this._getInternalServerError('invalid resource type');
            }
            if (resourceUuid) {
                const updateResourceData = await this.httpService.axiosRef.put(`${process.env.DOCSINK_ORG_API_URL}${path}/${resourceUuid}`,
                    data, {
                    headers: { Authorization: `Bearer ${botToken}` },
                });
                return updateResourceData.data;
            }
            else {
                const createResourceData = await this.httpService.axiosRef.post(`${process.env.DOCSINK_ORG_API_URL}${path}`,
                    data, {
                    headers: { Authorization: `Bearer ${botToken}` },

                });
                return createResourceData.data;
            }
        } catch (error) {
            if(error.status == 500){
                this._getBadRequestError(error.response.message);
            }
            console.log(`🚀 DocsinkService  ~ error:  in API call `, { method: error?.config?.method, Url: error?.config?.url, body: error?.config?.data, error: error?.response?.data?.errors });
            this._getBadRequestError(error?.response?.data);

        }
    }

    async retriveAppointmentTyps(botToken: string) {
        try {
            const appointmentsData = await this.httpService.axiosRef.get(`${process.env.DOCSINK_ORG_API_URL}/appointments/types`, {
                headers: { Authorization: `Bearer ${botToken}` },
            });
            return appointmentsData.data.data;
        } catch (error) {
            console.log("🚀 ~ file: docsink.service.ts:18 ~ DocsinkService ~ retriveAppointmentTyps ~ error: in API call", { method: error?.config?.method, Url: error?.config?.url, error: error?.response?.data })
            this._getBadRequestError(error?.response?.data)
        };
    }

    async retriveLocation(botToken: string) {
        try {
            const locationsData = await this.httpService.axiosRef.get(`${process.env.DOCSINK_ORG_API_URL}/locations`, {
                headers: { Authorization: `Bearer ${botToken}` },
            });
            return locationsData.data.data;
        } catch (error) {
            console.log("🚀 ~ file: docsink.service.ts:30 ~ DocsinkService ~ retriveLocation ~ error: in API call", { method: error?.config?.method, Url: error?.config?.url, error: error?.response?.data })
            this._getBadRequestError(error?.response?.data)
        };
    }

    async retriveOffices(botToken: string) {
        try {
            const officesData = await this.httpService.axiosRef.get(`${process.env.DOCSINK_ORG_API_URL}/organizations/offices`, {
                headers: { Authorization: `Bearer ${botToken}` },
            });
            return officesData.data.data;
        } catch (error) {
            console.log("🚀 ~ file: docsink.service.ts:42 ~ DocsinkService ~ retriveOffices ~ error: in API call", { method: error?.config?.method, Url: error?.config?.url, error: error?.response?.data })
            this._getBadRequestError(error?.response?.data)
        };
    }

    async retriveProvider(botToken: string) {
        try {
            const providersData = await this.httpService.axiosRef.get(`${process.env.DOCSINK_ORG_API_URL}/providers`, {
                headers: { Authorization: `Bearer ${botToken}` },
            });
            return providersData.data.data;
        } catch (error) {
            console.log("🚀 ~ file: docsink.service.ts:54 ~ DocsinkService ~ retriveProvider ~ error: in API call", { method: error?.config?.method, Url: error?.config?.url, error: error?.response?.data })
            this._getBadRequestError(error?.response?.data)
        };
    }

}

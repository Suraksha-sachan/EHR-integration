import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";


@Injectable()

export class MydataApiIntegrationService extends BaseService {
    constructor(private readonly httpService: HttpService) { super() }


    async fetchMydataLocation(mydataconfigUrl,apiToken,nextLink) {
        let path ;
        try {
            path = '/Location';
            if (nextLink) {
                let nextURL = nextLink.split('/fhir');
               // mydataconfigUrl = nextURL[0];
                path = nextURL[1]
            }
            return await this.httpService.axiosRef.get(`${mydataconfigUrl}/fhir${path}`, {
                headers: { Authorization: `Bearer ${apiToken}` }

            });

        } catch (error) {
            console.log(`🚀 ~ file: mydata.apiIntegration.ts:27 ~ MydataApiIntegrationService ~ fetchMydataLocation ~ error: in API call`,{method: error.config.method,Url:error.config.url, body: error.config.data,error:error.response?.data?.errors});
            this._getBadRequestError(`Get:${mydataconfigUrl}/fhir${path} api failed.`);

        }
    }


    async fetchMydataOrganization(mydataconfigUrl, apiToken) {
        try {
            return await this.httpService.axiosRef.get(`${mydataconfigUrl}/fhir/Organization`, {
                headers: { Authorization: `Bearer ${apiToken}` }

            });

        } catch (error) {
            console.log(`🚀 ~ file: mydata.apiIntegration.ts:41 ~ MydataApiIntegrationService ~ fetchMydataOrganization ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(`Get:${mydataconfigUrl}/fhir/Organization api failed.`);
        }
    }

    async fetchMydataPractitioner(mydataconfigUrl, apiToken, nextLink) {
        let path ;
        try {
             path = '/Practitioner';
            if (nextLink) {
                let nextURL = nextLink.split('/fhir');
                //mydataconfigUrl = nextURL[0];
                path = nextURL[1]
            }
            return await this.httpService.axiosRef.get(`${mydataconfigUrl}/fhir${path}`, {
                headers: { Authorization: `Bearer ${apiToken}` }

            });

        } catch (error) {
            console.log(`🚀 ~ file: mydata.apiIntegration.ts:62 ~ MydataApiIntegrationService ~ fetchMydataPractitioner ~ error: in API call `,  {method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(`Get:${mydataconfigUrl}/fhir${path} api failed.`);
        }
    }

    async fetchMydataPatient(mydataconfigUrl, apiToken, lastUpdated, nextLink) {
        let path;
        try {
            path = '/Patient';
            if (nextLink) {
                let nextURL = nextLink.split('/fhir');
               // mydataconfigUrl = nextURL[0];
                path = nextURL[1]
            } else if (lastUpdated) {
                path += `?_lastUpdated=gt${lastUpdated}`;
            }
            const mydataPatients = await this.httpService.axiosRef.get(`${mydataconfigUrl}/fhir${path}`, {
                headers: { Authorization: `Bearer ${apiToken}` }
            });
            return mydataPatients.data;

        } catch (error) {
            console.log(`🚀 ~ file: mydata.apiIntegration.ts:84 ~ MydataApiIntegrationService ~ fetchMydataPatient ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors} );
            this._getBadRequestError(`Get ${mydataconfigUrl}/fhir${path} api failed : ${error?.message}`);
        }
    }

    async fetchMydataPatientById(mydataconfigUrl: string, apiToken: string, patient_id: number) {
        let path;
        try {
            path = '/Patient';
            if (patient_id) {
                path += `/${patient_id}`
            }
            const mydataPatientById = await this.httpService.axiosRef.get(`${mydataconfigUrl}/fhir${path}`, {
                headers: { Authorization: `Bearer ${apiToken}` }
            });
            return mydataPatientById.data;

        } catch (error) {
            console.log("🚀 ~ file: mydata.apiIntegration.ts:99 ~ MydataApiIntegrationService ~ fetchMydataPatientById ~ error:", {method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors})
            this._getBadRequestError(`Get ${mydataconfigUrl}/fhir${path} api failed : ${error?.message}`);
        }
    }


    async fetchMydataAppointment(mydataconfigUrl, apiToken, lastUpdated,nextLink) {
        let path;
        try {
            path = '/Appointment';

            path = '/Appointment';
            if (nextLink) {
                let nextURL = nextLink.split('/fhir');
               // mydataconfigUrl = nextURL[0];
                path = nextURL[1]
            } else if (lastUpdated) {
                    path += `?_lastUpdated=gt${lastUpdated}`;  
            }

            const mydataAppointments = await this.httpService.axiosRef.get(`${mydataconfigUrl}/fhir${path}`, {
                headers: { Authorization: `Bearer ${apiToken}` }
            });
            return mydataAppointments.data;

        } catch (error) {
            console.log(`🚀 ~ file: mydata.apiIntegration.ts:122 ~ MydataApiIntegrationService ~ fetchMydataAppointment ~ error: in API call`, {method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(`Get ${mydataconfigUrl}/fhir${path} api failed : ${error?.message}`)

        }
    }

    async fetchImportAppointment(mydataconfigUrl, apiToken,practitioner_id,start_date,end_date)
    {
        let path;
        try{
            path = '/Appointment';
            const importAppointments = await this.httpService.axiosRef.get(`${mydataconfigUrl}/fhir${path}?actor=${practitioner_id}&date=ge${start_date}&date=le${end_date}`, {
                headers: { Authorization: `Bearer ${apiToken}` }
            });
            return importAppointments.data;

        }catch(error) {
            console.log("🚀 ~ file: mydata.apiIntegration.ts:145 ~ MydataApiIntegrationService ~ error: in Api call", {method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.response?.data ? JSON.stringify(error?.response?.data) : `Get ${mydataconfigUrl}/fhir${path} api failed`);
        }
    }
}

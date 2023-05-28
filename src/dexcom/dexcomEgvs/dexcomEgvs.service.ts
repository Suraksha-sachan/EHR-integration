import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { DexcomLogservice } from "src/middleware/dexcom.logs.service";
import { DexcomService } from "../dexcom.service";
import { DocsinkService } from "../docsink/docsink.service";
import { CreateLogsDto } from "src/middleware/dto/create-logs.dto";
@Injectable()

export class dexcomEgvsService extends BaseService {
    constructor(private dexcomService: DexcomService,
        private httpservice: HttpService,
        private dexcomLogservice: DexcomLogservice,
        private docsinkservice: DocsinkService) {
        super()
    }


    async resyncReadings(payload: any, logs: CreateLogsDto) {
        let responseData;
        let accessTokenId = null;
        try {

            let start_date = payload?.start_date;

            let end_date = payload?.end_date;

            let patientid = payload?.patient_id;

            let org_uuid = payload?.org_uuid;
            let count = 0;


            const getOrganizations = await this.docsinkservice.getDocsinkOrganizationByOrgUuid(org_uuid);

            if (getOrganizations.data.length == 0) {
                this._getNotFoundError('org is not found');

            }

            if (getOrganizations.data.length > 0) {

                let botconfig = getOrganizations.data[0].bot_configurations;

                if (botconfig.length == 0) {
                    this._getNotFoundError("configuration does not exist");
                }

                let bot_configurations = await botconfig.filter((config) => {
                    return config.collection == 'dexcom_configuration';

                });

                if (bot_configurations.length == 0) {
                    this._getNotFoundError("dexcom_configuration does not exist");
                }


                let item = bot_configurations[0].item;

                let collection = bot_configurations[0].collection;

                const dexcomConfig = await this.getBotConfiguration(collection, item);

                const botToken = dexcomConfig.data.docsink_bot_token;
                const dexcom_org = dexcomConfig.data.docsink_organization
                const enabled = dexcomConfig.data.enabled;

                if (enabled == true) {

                    let find = await this.docsinkservice.findDocsinkPatientByUuid(patientid, org_uuid);

                    if (find.length == 0) {
                        return this._getNotFoundError("patient does not exist");
                    }

                    let patientId = find[0]?.id;

                    let findDexcomPatient = await this.dexcomService.getDexcomAccessTokensbyPatientId(patientId);

                    if (findDexcomPatient.length == 0) {
                        return this._getNotFoundError("patient does not exist in dexcom");
                    }

                    let dexcomPaientId = findDexcomPatient.data[0].id;

                    let dexcomAccessTokens = findDexcomPatient.data[0].access_token;

                    accessTokenId = findDexcomPatient.data[0].id;

                    let readingsData = await this.dexcomService.fetchReadings(start_date, end_date, dexcomAccessTokens);
                    if (readingsData.egvs.length == 0) {
                        console.log('reding data not found')
                    }


                    if (readingsData && readingsData.egvs.length > 0) {
                        const unit = readingsData.unit;
                        const readingsArray = await Promise.all(readingsData.egvs.map(async (readings) => {
                            count++;

                            if (count > 10) {
                                return false;
                            }

                            const patient_uuid = payload?.patient_id;
                            readings["patient_uuid"] = patient_uuid;
                            readings['unit'] = unit;


                            const systemTime = readings.systemTime;
                            const checkDexcomegvsMapping = await this.dexcomService.getDexcomEgvs(systemTime, dexcomPaientId);
                            if (checkDexcomegvsMapping.data.length > 0) {

                                const getRpmMetricUuid = await this.docsinkservice.GetDocsinkRpmMetric(checkDexcomegvsMapping.data[0].docsink_rpm_metric);

                                readings["uuid"] = getRpmMetricUuid.data.uuid;

                                const docsinkRpmMetric = await this.docsinkservice.createOrUpdateDocsinkMetric(readings, botToken);

                                const updateDocsinkRpmMetricObject = { "value": docsinkRpmMetric.data.value };

                                const updatedMetricData = await this.docsinkservice.updateDocsinkRpmMetric(updateDocsinkRpmMetricObject, getRpmMetricUuid.data.id);

                                const docsinkRpmMetricId = updatedMetricData?.data.id;
                                if (readings.patient_uuid) {
                                    delete readings["patient_uuid"];
                                }
                                if (readings.uuid) {
                                    delete readings["uuid"];
                                }

                                const updateDexcomEgvsData = { "content": readings };

                                await this.dexcomService.updateDexcomEgvs(updateDexcomEgvsData, checkDexcomegvsMapping.data[0].id);
                            }
                            else {

                                const docsinkRpmMetric = await this.docsinkservice.createOrUpdateDocsinkMetric(readings, botToken);

                                const docsinkRpmItems = await this.docsinkservice.getDocsinkRpmItem(docsinkRpmMetric.data.rpm_item_uuid);

                                const saveDocsinkRpmMetricObject = { "uuid": docsinkRpmMetric.data.uuid, "docsink_patient": patientId, "docsink_organization": dexcom_org, "value": docsinkRpmMetric.data.value, "measure_unit": docsinkRpmMetric.data.measure_unit, "docsink_rpm_item": docsinkRpmItems.data[0].id };

                                const storedMetricData = await this.docsinkservice.saveDocsinkRpmMetric(saveDocsinkRpmMetricObject);

                                const docsinkRpmMetricId = storedMetricData.data.id;
                                if (readings.patient_uuid) {
                                    delete readings["patient_uuid"];
                                }

                                const saveDexcomEgvsData = { "content": readings, "access_token": dexcomPaientId, "docsink_rpm_metric": docsinkRpmMetricId, "systemtime": readings.systemTime };

                                await this.dexcomService.saveDexcomEgvs(saveDexcomEgvsData);

                            }


                        })

                        )

                        responseData = { message: "Reading resynced successfully" };
                        return responseData;

                    }

                }
            }

        } catch (error) {
            responseData = error.response;
            return this._getBadRequestError(error.message);
        } finally {

            let statusCodeResponse = logs.res;
            let data = {
                statuscode: statusCodeResponse['statusCode'],
                endpoint: logs.url,
                method: logs.method,
                access_token: accessTokenId,
                request_data: logs.body,
                response_data: responseData
            }
            await this.dexcomLogservice.saveLogdata(data);

        }
    }



    async getBotConfiguration(collection: string, id: number) {

        try {
            let find = await this.httpservice.axiosRef.get(
                `${process.env.BOTS_API_URL}/items/${collection}/${id}?fields=app_uuid,enabled,docsink_bot_token,docsink_organization`,
                {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                }
            );
            return find.data;

        } catch (error) {
            this._getBadRequestError(error.message);
        }
    }
}
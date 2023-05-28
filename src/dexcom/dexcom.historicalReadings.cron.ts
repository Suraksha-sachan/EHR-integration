import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import moment from "moment";
import { BaseService } from "src/abstract";
import { DexcomLogservice } from "src/middleware/dexcom.logs.service";
import { DexcomService } from "./dexcom.service";
import { DocsinkService } from "./docsink/docsink.service";

@Injectable()
export class HistoricalReadingsDataService extends BaseService {
  constructor(private readonly dexcomService: DexcomService,
    private readonly docsinkService: DocsinkService,
    private readonly dexcomLogservice: DexcomLogservice,
    private readonly httpService: HttpService) {
    super();
  }

  //@Cron("*/6  * * * *")

  async handleCron() {

    let req_body;
    try {

      let startDate = null;
      let endDate = null;
      let currentDateTime = null;
      let OrgID = null;
      let count: number = 0;

      const getOrganizations = await this.docsinkService.getDocsinkOrganizations();

      if (getOrganizations.data.length > 0) {

        await Promise.all(
          getOrganizations.data.map(async (org) => {
            OrgID = org.id;

            if (org.bot_configurations.length > 0) {

              await Promise.all(

                org.bot_configurations.map(async (botConfig) => {

                  const item = botConfig.item;
                  const collection = botConfig.collection;

                  if (collection == 'dexcom_configuration') {

                    const dexcomConfig = await this.getBotConfiguration(collection, item);

                    const botToken = dexcomConfig.data.docsink_bot_token;
                    const enabled = dexcomConfig.data.enabled;
                    OrgID = dexcomConfig.data.docsink_organization;

                    if (enabled == true) {

                      const dexcomAccessTokens = await this.dexcomService.getAllDexcomAccessTokens(OrgID);

                      if (dexcomAccessTokens.data.length > 0) {

                        await Promise.all(

                          dexcomAccessTokens.data.map(async (patientTokens) => {

                            if (!patientTokens.historical_sync) {

                              const patient_id = patientTokens.docsink_patient;
                              const org_id = patientTokens.docsink_organization;

                              const docsinkPatient = await this.docsinkService.fetchDocsinkPatientById(patient_id, org_id);
                              if (docsinkPatient.data.length > 0) {

                                const patient_uuid = docsinkPatient.data[0].uuid;

                                currentDateTime = Date.now();
                                startDate = moment(currentDateTime).subtract(90, "days").utc().format('YYYY-MM-DDTHH:mm:ss');
                                endDate = moment(currentDateTime).utc().format("YYYY-MM-DDTHH:mm:ss");

                                req_body = { startDate, endDate, access_token: patientTokens.access_token };

                                let readingsData = await this.dexcomService.fetchReadings(startDate, endDate, patientTokens.access_token);

                                if (readingsData && readingsData.egvs.length > 0) {
                                  const unit = readingsData.unit;

                                  await Promise.all(
                                    readingsData.egvs.map(async (readings) => {
                                      count++;

                                      if (count > 10) {
                                        return false;
                                      }

                                      readings["patient_uuid"] = patient_uuid;
                                      readings['unit'] = unit;
                                      const systemTime = readings.systemTime;
                                      const checkDexcomegvsMapping = await this.dexcomService.getDexcomEgvs(systemTime, patientTokens.id);

                                      if (checkDexcomegvsMapping.data.length > 0) {

                                        const getRpmMetricUuid = await this.docsinkService.GetDocsinkRpmMetric(checkDexcomegvsMapping.data[0].docsink_rpm_metric);
                                        readings["uuid"] = getRpmMetricUuid.data.uuid;

                                        const docsinkRpmMetric = await this.docsinkService.createOrUpdateDocsinkMetric(readings, botToken);

                                        const updateDocsinkRpmMetricObject = { "value": docsinkRpmMetric.data.value };

                                        const updatedMetricData = await this.docsinkService.updateDocsinkRpmMetric(updateDocsinkRpmMetricObject, getRpmMetricUuid.data.id);

                                        const docsinkRpmMetricId = updatedMetricData.data.id;
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
                                        const docsinkRpmMetric = await this.docsinkService.createOrUpdateDocsinkMetric(readings, botToken);

                                        const docsinkRpmItems = await this.docsinkService.getDocsinkRpmItem(docsinkRpmMetric.data.rpm_item_uuid);

                                        const saveDocsinkRpmMetricObject = { "uuid": docsinkRpmMetric.data.uuid, "docsink_patient": patient_id, "docsink_organization": org_id, "value": docsinkRpmMetric.data.value, "measure_unit": docsinkRpmMetric.data.measure_unit, "docsink_rpm_item": docsinkRpmItems.data[0].id };

                                        const storedMetricData = await this.docsinkService.saveDocsinkRpmMetric(saveDocsinkRpmMetricObject);

                                        const docsinkRpmMetricId = storedMetricData.data.id;

                                        if (readings.patient_uuid) {
                                          delete readings["patient_uuid"];
                                        }

                                        const saveDexcomEgvsData = { "content": readings, "access_token": patientTokens.id, "docsink_rpm_metric": docsinkRpmMetricId, "systemtime": readings.systemTime };

                                        await this.dexcomService.saveDexcomEgvs(saveDexcomEgvsData);
                                      }

                                    })
                                  );
                                  let data = {
                                    statuscode: 201,
                                    endpoint: 'Historical Reading Cron (5 min)',
                                    method: 'Cron',
                                    request_data: req_body,
                                    response_data: { message: "Dexcom Historical reading successfully created in docsink." }
                                  }
                                  await this.dexcomLogservice.saveLogdata(data);
                                }

                              }

                              await this.dexcomService.updatePatientHistoricalSync(patientTokens.id);
                            }
                          })
                        )


                      }

                    }
                  }
                })
              )
            }
          })
        )
      }
    } catch (error) {
      let data = {
        statuscode: error.status,
        endpoint: 'Historical Reading Cron (5 min)',
        method: 'Cron',
        request_data: req_body,
        response_data: error.response
      }
      await this.dexcomLogservice.saveLogdata(data);
      return this._getBadRequestError(error);
    }
  }

  async getBotConfiguration(collection: string, id: number) {
    try {
      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/${collection}/${id}?fields=app_uuid,enabled,docsink_bot_token,docsink_organization`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Get: ${process.env.BOTS_API_URL}/items/${collection}/${id}?fields=app_uuid,enabled,docsink_bot_token,docsink_organization api failed`);
    }
  }
}
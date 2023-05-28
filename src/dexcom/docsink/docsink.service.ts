import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/abstract";
import { docsinkReadingFormat } from "src/utils/dexcomToDocsinkReadingConversion";
import { Repository } from "typeorm";
import { DocsinkOrganization } from "./docsink.organization.entity";
import { DocsinkPatient } from "./docsink.patient.entity";

@Injectable()
export class DocsinkService extends BaseService {
  constructor(
    @InjectRepository(DocsinkPatient, process.env.BOTS_CONNECTION_NAME)
    private readonly docsinkPatientRepository: Repository<DocsinkPatient>,

    @InjectRepository(DocsinkOrganization, process.env.BOTS_CONNECTION_NAME)
    private readonly docsinkOrganizationRepository: Repository<DocsinkOrganization>,

    private readonly httpService: HttpService

  ) {
    super();
  }

  async findDocsinkPatientByUuid(uuid: number, org_uuid: number) {
    try {
      const result = await this.docsinkPatientRepository.query(
      `select dp.id  from integration.docsink_patient dp
      join integration.docsink_organization do2 
      on do2.id = dp.docsink_organization 
      and do2 .uuid = ${org_uuid}
      where dp.uuid = ${uuid};`);
      return result;

    } catch (err) {
      return this._getBadRequestError(`Get:docsink_patient by uuid query get failed.`);
    }
  }

  async findDocsinkOrganizationByUuid(uuid: number) {
    try {
      const result = await this.docsinkOrganizationRepository.query(`SELECT "id" from integration.docsink_organization where uuid ='${uuid}';`);
      return result;

    } catch (err) {
      return this._getBadRequestError(err.message);
    }
  }

  async fetchDocsinkPatientByUuid(patientId: number, bot_token: string) {
    try {

      let response = await this.httpService.axiosRef.get(`${process.env.DOCSINK_ORG_API_URL}/patients/${patientId}`,
        {
          headers: { Authorization: `Bearer ${bot_token}` }
        })
      return response.data;

    } catch (err) {
      this._getBadRequestError(`Get: ${process.env.DOCSINK_ORG_API_URL}/items/patients/${patientId} api failed.`); 
    }
  }

  async createDocsinkPatient(orgId: number, data: any) {
    try {
      let patientObject = {
        content: data,
        docsink_organization: orgId,
        address: data?.address,
        docsink_created_at: data?.created_at,
        date_of_birth: data?.dob,
        email: data.email ? data.email : null,
        first_name: data?.firstname,
        last_name: data?.lastname,
        gender: data?.gender,
        language: data?.language,
        med_rec_no: data?.med_rec_no,
        docsink_updated_at: data?.updated_at,
        user_uuid: data?.user_uuid,
        uuid: data?.uuid,
        insurances: data.insurances ? data.insurances : [],
        is_active: data?.active,
        phone_no: data.phone_no ? data.phone_no : null

      }      
      let response = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_patient`,
        patientObject,
        {
          headers:
          {
            Authorization: `Bearer ${process.env.BOTS_API_TOKEN}`,
            "Content-Type": "application/json",
          }
        })
      return response.data;

    } catch (err) {
      this._getBadRequestError(`POST: ${process.env.BOTS_API_URL}/items/docsink_patient api failed.`); 
    }
  }

  async getDocsinkOrganizations() {
    try {
      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/docsink_organization?fields=id,uuid,name&fields=bot_configurations.item,bot_configurations.collection&filter={"count(bot_configurations)":{"_gt":0}}`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Get: ${process.env.BOTS_API_URL}/items/docsink_organization?fields=id,uuid,name&fields=bot_configurations.item,bot_configurations.collection&filter={"count(bot_configurations)":{"_gt":0}} api falied`); 
  }
}


  async getDocsinkOrganizationByOrgUuid(orgid: number) {

    try {
      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/docsink_organization?fields=id,uuid,name&fields=bot_configurations.item,bot_configurations.collection&filter={"uuid":{"_eq":${orgid}}}`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;
    } catch (error) { }
  }

  async fetchDocsinkPatientById(id: number, org_id: number) {
    try {
      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/docsink_patient?filter={"id":{"_eq":${id}},"docsink_organization":{"_eq":${org_id}}}`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`${process.env.BOTS_API_URL}/items/docsink_patient?filter={"id":{"_eq":${id}},"docsink_organization":{"_eq":${org_id}}} api failed`);
    }

}

async createOrUpdateDocsinkMetric(request: any , bot_token : string) {
  try {
    const docsinkReadingResponse = await docsinkReadingFormat(request);
    let readingsData;
    if (docsinkReadingResponse.uuid) {
      readingsData = await this.httpService.axiosRef.put(
        `${process.env.DOCSINK_ORG_API_URL}/rpm/metrics/${docsinkReadingResponse.uuid}`,
        JSON.stringify(docsinkReadingResponse),
        {
          headers: {
            Authorization: `Bearer ${bot_token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    else {
      readingsData = await this.httpService.axiosRef.post(
        `${process.env.DOCSINK_ORG_API_URL}/rpm/metrics`,
        JSON.stringify(docsinkReadingResponse),
        {
          headers: {
            Authorization: `Bearer ${bot_token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
      return readingsData.data;  

  } catch (error) {
    console.log(error);
    return this._getBadRequestError(`${process.env.DOCSINK_ORG_API_URL}/rpm/metrics api failed`);
  }
}

async getDocsinkRpmItem(uuid : number) {
  try {
    let find = await this.httpService.axiosRef.get(
      `${process.env.BOTS_API_URL}/items/docsink_rpm_item?&filter={"uuid":{"_eq":${uuid}}}`,
      {
        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
      }
    );
    return find.data;

  } catch (error) {
    this._getBadRequestError(`Get: ${process.env.BOTS_API_URL}/items/docsink_rpm_item?&filter={"uuid":{"_eq":${uuid}}} api failed`);
  }

}

async saveDocsinkRpmMetric(data : any) {
  try {
    let find = await this.httpService.axiosRef.post(
      `${process.env.BOTS_API_URL}/items/docsink_rpm_metric`,
      data,
      {
        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
      }
    );
    return find.data;

  } catch (error) {
    this._getBadRequestError(`Post:${process.env.BOTS_API_URL}/items/docsink_rpm_metric`);
  }

}

async updateDocsinkRpmMetric(data : any , id:number) {
  try {
    let find = await this.httpService.axiosRef.patch(
      `${process.env.BOTS_API_URL}/items/docsink_rpm_metric/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
      }
    );
    return find.data;

  } catch (error) {
    this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/docsink_rpm_metric/${id} api failed`);
  }

}

async GetDocsinkRpmMetric(id : number) {
  try {
    let find = await this.httpService.axiosRef.get(
      `${process.env.BOTS_API_URL}/items/docsink_rpm_metric/${id}`,
      {
        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
      }
    );
    return find.data;

  } catch (error) {
    this._getBadRequestError(`Get: ${process.env.BOTS_API_URL}/items/docsink_rpm_metric/${id} api failed`);
  }

}

}
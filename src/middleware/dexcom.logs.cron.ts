import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BaseService } from "src/abstract";
import { InjectRepository } from "@nestjs/typeorm";
import { DexcomLogs } from "./dexcom.logs.entity";
import { Repository } from "typeorm";

@Injectable()
export class DeleteLogsService extends BaseService {
  constructor(
    @InjectRepository(DexcomLogs, process.env.BOTS_CONNECTION_NAME)
    private readonly dexcomLogsRepository: Repository<DexcomLogs>
  ) {
    super();
  }

  @Cron("0 0 */3 * *")
  async handleDeleteLogCron() {
    try {
      await this.dexcomLogsRepository.createQueryBuilder('dexcom_logs')
        .delete()
        .from(DexcomLogs)
        .where("response_data = :value", { value: { "message": "No reading found." } })
        .execute()

        return 'Dexcom Logs is removed that have in the response_data field: “{"message":"No reading found."}“.'

    } catch (error) {
      console.log("🚀 ~ file: dexcom.logs.cron.ts:29 ~ DeleteLogsService ~ handleDeleteLogCron ~ error:", error)
      return this._getBadRequestError(`Error while deleting logs from dexcom_logs table.`);
    }

  }
}
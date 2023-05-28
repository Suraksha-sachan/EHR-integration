import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/abstract";
import { DexcomLogservice } from "src/middleware/dexcom.logs.service";
import { Repository } from "typeorm";
import { Dexcom } from "./dexcom.entity";
import { DexcomService } from "./dexcom.service";

@Injectable()
export class TokenRefreshService extends BaseService {
    constructor(
        private readonly dexcomService: DexcomService,
        private readonly dexcomLogservice:DexcomLogservice,

        @InjectRepository(Dexcom, process.env.BOTS_CONNECTION_NAME)
        private readonly dexcomRepository: Repository<Dexcom>
    ) {
        super();
    }
    private readonly logger = new Logger(TokenRefreshService.name);
    @Cron("*/10  * * * *")
    async handleCron() {
        let req_body;
        let accessTokenId = null;
        try {
            
           const patientResponse = await this.dexcomService.GetDexcomAccessTokensData();

            if (patientResponse.length > 0) {
                await Promise.all(
                    patientResponse.map(async (patientData) => {
                        req_body = {refresh_token:patientData.refresh_token}
                        accessTokenId = patientData.id;
                        await this.dexcomService.refreshDexcomToken(patientData.refresh_token, patientData.id);

                        let data = {
                            statuscode: 200,
                            endpoint: 'Refresh Dexcom Token Cron (10 min)',
                            method: 'Cron',
                            access_token: patientData.id,
                            request_data: req_body,
                            response_data: 'Dexcom Token Refreshed Successfully.'
                          }
                        this.dexcomLogservice.saveLogdata(data);
                    })
                );
            }

        } catch (error) {
            console.log("🚀 ~ file: dexcom.refreshToken.cron.ts:51 ~ TokenRefreshService ~ handleCron ~ error:", error.response)
            let data = {
                statuscode: error.status,
                endpoint: 'Refresh Dexcom Token Cron (10 min)',
                method: 'Cron',
                access_token:accessTokenId,
                request_data: req_body,
                response_data: error.response
              }
            this.dexcomLogservice.saveLogdata(data);
            return this._getBadRequestError(error);
        }
    }
}
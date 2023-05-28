import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstract';
import { Repository } from 'typeorm';
import { athena_appointment } from './athena_appointment.entity';

@Injectable()
export class AthenaMydataService extends BaseService {
    constructor(
        @InjectRepository(athena_appointment, process.env.BOTS_CONNECTION_NAME)
        private readonly mydataRepository: Repository<athena_appointment>) {
        super();
    }

    async updatestatus(payload: any, api_key: string) {
        try {

            if (!api_key) {
                this._getBadRequestError(`Api-Key field is required in headers.`);
            }

            let appointmentdata = await this.mydataRepository.query(
                `SELECT as2.api_key ,aa.appointment_id , aa.id FROM athena_mydata.athena_appointment aa 
                 LEFT JOIN athena_mydata.athena_server as2 
                 ON as2 .id = aa.athena_server_id 
                 AND as2.api_key = '${api_key}'
                 WHERE aa.appointment_id = '${payload.appointment_id}';`);

            if (appointmentdata.length == 0 || !appointmentdata[0].appointment_id) {
                this._getNotFoundError(`appointment with ID:${payload.appointment_id} does not exist`);
            }

            if (!appointmentdata[0].api_key) {
                return this._getUnauthorizedError('Api-Key is not authorized, not mapped to server.');
            }

            let id = appointmentdata[0].id;
            if (payload.cancelled_at) {

                await this.mydataRepository.update(id, {
                    ...{ status: "cancelled" },
                    ...{ last_updated_at: payload.cancelled_at }
                });
            }

        } catch (error) {
            return this._getBadRequestError(error.message);
        }

    }

}


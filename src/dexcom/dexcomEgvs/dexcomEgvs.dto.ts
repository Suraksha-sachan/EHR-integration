import { IsNotEmpty } from 'class-validator';

export class CreateEgvsDto {

    @IsNotEmpty()
    start_date: Date;

    @IsNotEmpty()
    end_date: Date;

    @IsNotEmpty()
    patient_id: number;

    @IsNotEmpty()
    org_uuid: number;

}
import { IsNotEmpty } from 'class-validator';

export class CancelAppointmentDto {

    @IsNotEmpty()
    appointment_id: string;

    @IsNotEmpty()
    cancelled_at: Date;

}
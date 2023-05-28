import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString,IsNotEmpty, isNumber } from 'class-validator';

export class FaxNumberChatDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'fax_number' })
    fax_number: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'chat_id' })
    chat_id: string[];
}
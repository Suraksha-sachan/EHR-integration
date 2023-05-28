import { ApiProperty } from '@nestjs/swagger';
import {IsString,IsNotEmpty } from 'class-validator';

export class CreateLogsDto {
    @ApiProperty({ description: 'status_code', required: true })
    @IsString()
    @IsNotEmpty()
    statuscode: string
  
    @ApiProperty({ description: 'url', required: true })
    @IsString()
    url: string;
  
    @ApiProperty({ description: 'method', required: true,})
    @IsString()
    method: string;

    @ApiProperty({ description: 'request_data', required: true,})
    @IsString()
    body: string;

    @ApiProperty({ description: 'res', required: true,})
    res: object;

  }
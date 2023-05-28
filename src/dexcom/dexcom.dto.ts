import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString,IsNotEmpty } from 'class-validator';

export class CreateDexcomDto {
    @ApiProperty({ description: 'access_token', required: true })
    @IsString()
    @IsNotEmpty()
    access_token: string
  
    @ApiProperty({ description: 'refresh_token', required: true })
    @IsString()
    refresh_token: string;
  
    @ApiProperty({ description: 'expires_in', required: true,})
    @IsNumber()
    expires_in: number;

  }
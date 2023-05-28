import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean,IsNotEmpty} from 'class-validator';

export class EhrFaxorderDto {
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'active' })
    active: boolean;
}
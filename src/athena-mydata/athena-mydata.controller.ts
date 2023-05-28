import { Body, Controller, Get, Headers, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CancelAppointmentDto } from './athena-appointment.dto';
import { AthenaMydataService } from './athena-mydata.service';
import { DocsinkUpsertService } from './docsink_upsert/docsinkEntities.cron';
import { TokenManagerService } from './tokenManager/token.cron';

@Controller('athena-mydata')
export class AthenaMydataController {
  constructor(
    private readonly athenaMydataService: AthenaMydataService,
    private readonly docsinkUpsertService: DocsinkUpsertService,
    private readonly tokenManagerService: TokenManagerService
    ) { }

  @Post('/appointment/cancelled')
  @HttpCode(200)
  
  @UsePipes(new ValidationPipe({ transform: true }))

  async update_appointment(@Body() Body: CancelAppointmentDto , @Headers('Api-Key') api_key: string) {

    return await this.athenaMydataService.updatestatus(Body , api_key)

  }

  @Get('/org-data-cron')
  async fetchDocsinkEntities() {

    return await this.docsinkUpsertService.handleCron();

  }

  @Get('/token-manager-cron')
  async fetchOrRenewToken() {

    return await this.tokenManagerService.handleCron();

  }

}

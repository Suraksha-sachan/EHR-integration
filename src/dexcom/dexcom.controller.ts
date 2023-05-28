import { Body, Controller, Get, Post, Headers, Req, Request, UseGuards, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLogsDto } from 'src/middleware/dto/create-logs.dto';
import { CreateDexcomDto } from './dexcom.dto';
import { DexcomService } from './dexcom.service';
import { CreateEgvsDto } from './dexcomEgvs/dexcomEgvs.dto';
import { dexcomEgvsService } from './dexcomEgvs/dexcomEgvs.service';
import { DeleteLogsService } from 'src/middleware/dexcom.logs.cron';
import { TokenRefreshService } from './dexcom.refreshToken.cron';
import { TasksService } from './dexcom.readings.cron';
@Controller('dexcom')
export class DexcomController {
  constructor(
    private readonly dexcomService: DexcomService,
    private readonly dexcomegvsService: dexcomEgvsService,
    private readonly deleteLogsService: DeleteLogsService,
    private readonly tokenRefreshService: TokenRefreshService,
    private readonly tasksService: TasksService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/verify')

  storeDexcomToken(
    @Body() body: CreateDexcomDto,
    @Req() patient: any,
    @Request() Request: CreateLogsDto
  ) {
    return this.dexcomService.storeDexcomToken(body, patient.user, Request);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/patientSync')

  getPatientSynced(
    @Req() patient: any,
    @Request() request: CreateLogsDto
  ) {
    return this.dexcomService.getPatientSynced(patient.user, request);
  }


  @Post('/resync_readings')

  @UsePipes(new ValidationPipe({ transform: true }))

  storedresyncdata(@Body() creategvsDto: CreateEgvsDto, @Request() request: CreateLogsDto
  ) {
    return this.dexcomegvsService.resyncReadings(creategvsDto, request);

  }
  // Test delete cron (runs in every three days.)

  @Get('/delete_logs')

  async deleteLogs(@Headers('Authorization') authorization: string) {

    let validateToken = await this.dexcomService.validateDexcomConfigurationToken(authorization);

    if (!validateToken || validateToken.data.length == 0) {
      throw new UnauthorizedException({ 'message': 'Unauthorized access' })
    } else {
      return await this.deleteLogsService.handleDeleteLogCron();
    }
  }

  // Test token refresh cron (runs in every 10 minutes.)  
  @Get('/refresh_token')

  async startTokenRefreshCron(@Headers('Authorization') authorization: string) {

    const validateToken = await this.dexcomService.validateDexcomConfigurationToken(authorization);

    if (!validateToken || validateToken.data.length == 0) {
      throw new UnauthorizedException({ 'message': 'Unauthorized access' })
    }
    else {
      return await this.tokenRefreshService.handleCron();
    }
  }

  // Test retreive new readings cron (runs in every 5 minutes.)  
  @Get('/new_readings')
  async startNewReadingsCron(@Headers('Authorization') authorization: string) {

    const validateToken = await this.dexcomService.validateDexcomConfigurationToken(authorization);

    if (!validateToken || validateToken.data.length == 0) {
      throw new UnauthorizedException({ 'message': 'Unauthorized access' })
    }
    else {
      return await this.tasksService.handleCron();
    }
  }

  // Test ci/cd on develop
  
  @Get('/develop')
  async testDevelop() {

    return this.dexcomService.TestDevelop();
  }

}

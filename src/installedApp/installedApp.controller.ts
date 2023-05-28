import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InstalledAppService } from './installedApp.service';

@Controller('installed-app-info')
export class InstalledAppController {
  constructor(private readonly installedAppService: InstalledAppService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getInstalledApp(@Req() request : any) {
    return this.installedAppService.getInstalledApp(request.user);
  }
}

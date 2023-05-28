import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatGroupsService } from './chatGroups.service';

@Controller('channel-groups')
export class ChatGroupsController {
  constructor(private readonly chatGroupsService: ChatGroupsService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllGroups(@Req() request : any) {
    return this.chatGroupsService.findAll(request.user);
  }
}

import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { EhrFaxorderDto } from './ehrFaxorder.dto';
import { EhrFaxorderService } from './ehrFaxorder.service';
import { FaxNumberChatDto } from './faxNumberChat/faxNumberChat.dto';
import { FaxNumberChatService } from './faxNumberChat/faxNumberChat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('ehr_fax_order')
@UseInterceptors(ClassSerializerInterceptor)
export class EhrFaxorderController {
  constructor(
    private readonly faxorderService: EhrFaxorderService,
    private readonly faxNumberChatService: FaxNumberChatService) { }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllFaxOrders(@Req() request : any) {
    return this.faxorderService.findAll(request.user);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/:uuid')
  updateFaxOrders(@Param('uuid') uuid: number, @Body() body: EhrFaxorderDto,@Req() request : any) {
    return this.faxorderService.updateEhrFaxOrder(uuid, body, request.user);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/fax_numbers')
  getAllFaxNumberChat(@Req() request : any) {
    return this.faxNumberChatService.findAll(request.user);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/fax_numbers/:uuid')
  getFaxNumberChatById(@Param('uuid') uuid: number) {
    return this.faxNumberChatService.findFaxNumberChatByUUID(uuid);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/fax_numbers')
  createFaxNumberChat(@Body() body: FaxNumberChatDto, @Req() request : any) {
    return this.faxNumberChatService.createFaxNumberChat(body , request.user);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/fax_numbers/:uuid')
  updateFaxNumberChat(@Param('uuid') uuid: number, @Body() body: FaxNumberChatDto) {
    return this.faxNumberChatService.updateFaxNumberChat(uuid, body);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/fax_numbers/:uuid')
  deleteFaxNumberChat(@Param('uuid') uuid: number) {
    return this.faxNumberChatService.deleteFaxNumberChat(uuid);

  }
}

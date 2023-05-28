import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { BotsService } from './bots.service';

@Controller('/integration/docsink/events')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}


  @Post('/')
  create(@Body() body) {
    
    console.log("🚀 ~ file: bots.controller.ts:11 ~ BotsController ~ create ~ body:", body)
    
    if(!body.org_uuid){
      return HttpCode(200);
    }
    return this.botsService.docsinkEvent(body);
  }

 
}

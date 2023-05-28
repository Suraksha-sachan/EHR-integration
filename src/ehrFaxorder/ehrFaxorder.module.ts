import { Module } from '@nestjs/common';
import { EhrFaxorderService } from './ehrFaxorder.service';
import { EhrFaxorderController } from './ehrFaxorder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EhrFaxOrder } from './ehrFaxorder.entity';
import { FaxNumberChatService } from './faxNumberChat/faxNumberChat.service';
import { FaxNumberChat } from './faxNumberChat/faxNumberChat.entity';
@Module({
  imports: [TypeOrmModule.forFeature([EhrFaxOrder,FaxNumberChat])],
  controllers: [EhrFaxorderController],
  providers: [EhrFaxorderService,FaxNumberChatService]
})
export class EhrFaxorderModule {}

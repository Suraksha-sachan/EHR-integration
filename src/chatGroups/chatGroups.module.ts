import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ChatGroupsService } from './chatGroups.service';
import { ChatGroupsController } from './chatGroups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGroups } from './chatGroups.entity';

@Global()
@Module({
  imports : [TypeOrmModule.forFeature([ChatGroups],process.env.POSTGRES_CONNECTION_NAME)],
  controllers: [ChatGroupsController],
  providers: [ChatGroupsService],
  exports: [ChatGroupsService]
})
 export class ChatGroupsModule {}

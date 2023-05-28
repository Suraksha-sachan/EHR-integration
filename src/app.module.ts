import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule} from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmBotsPgsqlConfig, createTypeOrmMysqlConfig, createTypeOrmPgsqlConfig } from './database';
import { EhrFaxorderModule } from './ehrFaxorder/ehrFaxorder.module';
import { ChatGroupsModule } from './chatGroups/chatGroups.module';
import { InstalledAppModule } from './installedApp/installedApp.module';
import { AuthModule } from './auth/auth.module';
import { DexcomModule } from './dexcom/dexcom.module';
import { BotsModule } from './bots/bots.module';
import { AthenaMydataModule } from './athena-mydata/athena-mydata.module';
import { MockApiModule } from './mock-api/mock-api.module';
import { DocsinkModule } from './docsink/docsink.module';
import { DirectusModule } from './directus/directus.module';

@Module({
  imports: [ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(
      createTypeOrmMysqlConfig({
        entities: ['dist/**/*.entity{.ts,.js}'],
        type: 'mysql',
            }),
    ),
     TypeOrmModule.forRoot(
      createTypeOrmPgsqlConfig({
        entities: ['dist/**/*.entity{.ts,.js}'],
        type: 'postgres',
            }),
    ), 
    TypeOrmModule.forRoot(
      createTypeOrmBotsPgsqlConfig({
        entities: ['dist/**/*.entity{.ts,.js}'],
        type: 'postgres',
            }),
    ),
    EhrFaxorderModule,
    ChatGroupsModule,
    InstalledAppModule,
    AuthModule,
    DexcomModule,
    BotsModule,
    AthenaMydataModule,
    MockApiModule,
    DocsinkModule,
    DirectusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

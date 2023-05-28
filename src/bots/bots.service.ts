import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { BotInstallationService } from "./eventsServices/botInstallation.service";
import { BotUninstallService } from "./eventsServices/botreinstall.service";
import { NewBotInstallService } from "./eventsServices/newBotinstall.service";
import { inFlowfile } from "./inflowFile.data";
import { DexcomLogservice } from "src/middleware/dexcom.logs.service";

@Injectable()
export class BotsService extends BaseService {
  constructor(
    private readonly botInstallationService: BotInstallationService,
    private readonly newBotInstallService: NewBotInstallService,
    private readonly botUninstallService: BotUninstallService,
    private readonly dexcomLogservice: DexcomLogservice
  ) {
    super();
  }

  async docsinkEvent(event: any) {
    try {
      let payload = {
        content: event,
        event_name: event.event_name,
        event_time: event.event_time,
        app_uuid: event.app_uuid,
        organization_uuid: event.org_uuid,
      };
      
      console.log("🚀 ~ file: bots.service.ts:21 ~ BotsService ~ docsinkEvent ~ event:", event)

      await this.botInstallationService.storeEventinDb(payload);
      let findBotDetail = await this.botInstallationService.findBotName(event.app_uuid);

      if (findBotDetail.data.length == 0) {
        this._getNotFoundError("Bot Not Found");
      }

      if ((findBotDetail.data[0].bot_name == 'dexcom') && ((event.event_name == 'bot-installation') || (event.event_name == 'bot-uninstallation'))) {
        const logData = {
          statuscode: 200,
          endpoint: event.event_name,
          method: 'POST',
          request_data: event,
          response_data: event
        };

        await this.dexcomLogservice.saveLogdata(logData);
      }

      let apiResponseBody = {
        bot_configuration_name: findBotDetail.data[0].bot_configuration_name,
        bot_name: findBotDetail.data[0].bot_name,
      };

      let botSetting = await this.botInstallationService.getBotSetting(
        apiResponseBody.bot_name
      );

      let inflowFile = await inFlowfile(botSetting, apiResponseBody.bot_name);

      let findCount = await this.newBotInstallService.captureOrganizationCount(
        event.org_uuid
      );

      let count = findCount.data.length;

      if (count == 0 && event.event_name == "bot-installation") {
        return await this.createBotConfig(event, apiResponseBody.bot_configuration_name);
      }

      if (
        (count > 0 && event.event_name == "bot-uninstallation") ||
        event.event_name == "bot-installation"
      ) {
        const org_id = findCount.data[0].id;
        return await this.botUninstallorReinstall(
          event,
          apiResponseBody.bot_configuration_name,
          org_id
        );
      }
    } catch (error) {
      console.log("🚀 ~ file: bots.service.ts:82 ~ BotsService ~ docsinkEvent ~ error:", error)
      this._getBadRequestError(error);
    }
  }

  async createBotConfig(bot, bot_configuration_name) {
    try {
      let replaceText = {
        uuid: bot.org_uuid,
        name: bot.payload.org_name,
      };

      let create =
        await this.newBotInstallService.createDocsInkOrganizationtoBotDb(
          replaceText
        );

      let docsinkOrgUuid = create?.data?.id;

      let createBotConfigration = {
        docsink_organization: docsinkOrgUuid,
        docsink_bot_token: bot.payload.token,
        installed_by: bot.payload.installed_by,
        enabled: true,
        app_uuid:bot?.app_uuid
      };

      let creatConfig = await this.newBotInstallService.createBotConfiguration(createBotConfigration, bot_configuration_name);

      let botConfigurationId = creatConfig.data.id;
      let getBotInfo = await this.newBotInstallService.getBotConfigurations(bot.org_uuid);

      let ConfigObject = {
        item: botConfigurationId,
        collection: bot_configuration_name,
      };

      let newConfig;
      newConfig = getBotInfo.data[0];
      newConfig["bot_configurations"].push(ConfigObject);

      let updateBotConfigurations =
        await this.newBotInstallService.updateBotConfigurations(
          createBotConfigration.docsink_organization,
          newConfig
        );

        const botSuccessInstalledLog = {
          statuscode: 200,
          endpoint: bot.event_name,
          method: 'POST',
          request_data: bot,
          response_data: `{'message' : 'Bot was successfully installed.'}`
        };

        await this.dexcomLogservice.saveLogdata(botSuccessInstalledLog);

      return updateBotConfigurations;


    } catch (error) {
      console.log("🚀 ~ file: bots.service.ts:144 ~ BotsService ~ createBotConfig ~ error:", error)
      this._getBadRequestError(error.message);
    }
  }

  async createReinstalledBotConfig(bot, bot_configuration_name,org_id) {
    try{
      let createBotConfigration = {
        docsink_organization: org_id,
        docsink_bot_token: bot.payload.token,
        installed_by: bot.payload.installed_by,
        enabled: true,
        app_uuid: bot?.app_uuid
      };

      let creatConfig = await this.newBotInstallService.createBotConfiguration(createBotConfigration, bot_configuration_name);

      let botConfigurationId = creatConfig.data.id;
      let getBotInfo = await this.newBotInstallService.getBotConfigurations(bot.org_uuid);

      let ConfigObject = {
        item: botConfigurationId,
        collection: bot_configuration_name,
      };

      let newConfig;

      if (getBotInfo.data[0].bot_configurations.length > 0) {
           newConfig = getBotInfo.data[0];
           newConfig["bot_configurations"].push(ConfigObject);

      }

      else {
        newConfig = getBotInfo.data[0];
        newConfig["bot_configurations"].push(ConfigObject);

      }

      let updateBotConfigurations =
        await this.newBotInstallService.updateBotConfigurations(
          createBotConfigration.docsink_organization,
          newConfig
        );

        const botSuccessInstalledLog = {
          statuscode: 200,
          endpoint: bot.event_name,
          method: 'POST',
          request_data: bot,
          response_data: `{'message' : 'Bot was successfully Installed.'}`
        };

        await this.dexcomLogservice.saveLogdata(botSuccessInstalledLog);

      return updateBotConfigurations;


    } catch (error) {
      console.log("🚀 ~ file: bots.service.ts:202 ~ BotsService ~ createReinstalledBotConfig ~ error:", error)
      this._getBadRequestError(error.message);
    }
  }

  async botUninstallorReinstall(bot, bot_configuration_name: string , org_id: number) {

    try {
      let getConfig = await this.botUninstallService.getBotConfiguration(
        bot_configuration_name,
        bot.org_uuid
      );

      if (bot.event_name == 'bot-uninstallation' && getConfig.data.length > 0) {

        let botConfigurationId = getConfig?.data[0].id;
        let replaceText =
        {
          enabled: false,
          docsink_bot_token: null,
        }
        let botuninstall = await this.botUninstallService.botuninstall(botConfigurationId,
          bot_configuration_name,
          replaceText);

        const botSuccessInstalledLog = {
            statuscode: 200,
            endpoint: bot.event_name,
            method: 'POST',
            request_data: bot,
            response_data: `{'message' : 'Bot was successfully Uninstalled.'}`
          };
  
          await this.dexcomLogservice.saveLogdata(botSuccessInstalledLog);

        return botuninstall;
      }

      if (bot.event_name == 'bot-installation') {

        if (getConfig.data.length == 0) {

          return await this.createReinstalledBotConfig(bot, bot_configuration_name, org_id);
  
        }

        let botConfigurationId = getConfig?.data[0].id;
        let replaceText = {
          docsink_bot_token: bot.payload.token,
          installed_by: bot.payload.installed_by,
          enabled: true,
          app_uuid: bot?.app_uuid
        };

        let updateData = await this.botUninstallService.updateBotConfiguration(
          bot_configuration_name,
          botConfigurationId,
          replaceText
        );

        const botSuccessInstalledLog = {
          statuscode: 200,
          endpoint: bot.event_name,
          method: 'POST',
          request_data: bot,
          response_data: `{'message' : 'Bot was successfully Re-installed.'}`
        };

        await this.dexcomLogservice.saveLogdata(botSuccessInstalledLog);

        return updateData;

      }

    } catch (error) { 
      console.log("🚀 ~ file: bots.service.ts:275 ~ BotsService ~ botUninstallorReinstall ~ error:", error)
      return this._getBadRequestError(error.message);
    }
  }
}

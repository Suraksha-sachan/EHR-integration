import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";


@Injectable()
export class BotInstallationService extends BaseService{
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async storeEventinDb(event: any) {
    try {
      let response = await this.httpService.axiosRef.post(
        `${process.env.BOTS_API_URL}/items/docsink_event`,
        event,
        {
          headers: {
            Authorization: `Bearer ${process.env.BOTS_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      return response.data;
    } catch (error) {
        console.log("🚀 ~ file: botInstallation.service.ts:27 ~ BotInstallationService ~ storeEventinDb ~ error:", error)
        this._getBadRequestError(error.message);    }
  }

  async findBotName(app_uuid:number) {
    try {
      let api = `${process.env.BOTS_API_URL}/items/docsink_app?filter={"uuid":${app_uuid}}&fields=bot_name,bot_configuration_name`;

      let response = await this.httpService.axiosRef.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.BOTS_API_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
       console.log("🚀 ~ file: botInstallation.service.ts:42 ~ BotInstallationService ~ findBotName ~ error:", error)
       this._getBadRequestError(error.message);    
    }
  }


    async getBotSetting(bot_name:string){
        try {

            let response = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/${bot_name}`,{
                headers:{Authorization:`Bearer ${process.env.BOTS_API_TOKEN}`,}
            })

            return response.data
            
        } catch (error) {
            this._getBadRequestError(error.message);  
        }

    }




}

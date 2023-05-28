import { Injectable } from '@nestjs/common';
import { Directus } from "@directus/sdk";
import { BaseService } from 'src/abstract';
const directus = new Directus(process.env.BOTS_API_URL, { auth: { staticToken: process.env.BOTS_API_TOKEN } });

@Injectable()
export class DirectusService extends BaseService {

    async fetchCollectionAllItems(collection: string) {
        try {
            const response = await directus.items(`${collection}`).readByQuery();
            return response;

        } catch (error) {
            console.log("🚀 ~ file: directus.service.ts:14 ~ DirectusService ~ fetchCollectionAllItems ~ error:", { method: error?.parent?.config?.method, baseURL: error?.parent?.config?.baseURL, path: error?.parent?.config?.url, body: error?.parent?.config?.data, error: error?.response?.errors })
            this._getBadRequestError(error?.response?.errors);
        }
    }

    async fetchCollectionFilteredItem(collection: string, fields: string, filter: string) {
        try {
            const response = await directus.items(`${collection}`).readByQuery({ 'fields': `${fields}`, 'filter': `${filter}` })
            return response;

        } catch (error) {
            console.log("🚀 ~ file: directus.service.ts:23 ~ DirectusService ~ fetchCollectionFilteredItem ~ error:", { method: error?.parent?.config?.method, baseURL: error?.parent?.config?.baseURL, path: error?.parent?.config?.url, body: error?.parent?.config?.data, error: error?.response?.errors })
            this._getBadRequestError(error?.response?.errors);

        }
    }

    async fetchCollectionItemById(collection: string, id: number) {
        try {
            const response = await directus.items(`${collection}`).readOne(`${id}`);
            return response;

        } catch (error) {
            console.log("🚀 ~ file: directus.service.ts:34 ~ DirectusService ~ fetchCollectionItemById ~ error:", { method: error?.parent?.config?.method, baseURL: error?.parent?.config?.baseURL, path: error?.parent?.config?.url, body: error?.parent?.config?.data, error: error?.response?.errors })
            this._getBadRequestError(error?.response?.errors);

        }
    }

    async createCollectionItem(collection: string, payload: any) {
        try {
            const response = await directus.items(`${collection}`).createOne(JSON.parse(`${payload}`));
            return response;

        } catch (error) {
            console.log("🚀 ~ file: directus.service.ts:43 ~ DirectusService ~ storeCollectionItem ~ error:", { method: error?.parent?.config?.method, baseURL: error?.parent?.config?.baseURL, path: error?.parent?.config?.url, body: error?.parent?.config?.data, error: error?.response?.errors })
            this._getBadRequestError(error?.response?.errors);

        }
    }

    async updateCollectionItemById(collection: string, id: number, payload: any) {
        try {
            const response = await directus.items(`${collection}`).updateOne(`${id}`,JSON.parse(`${payload}`));
            return response;

        } catch (error) {
            console.log("🚀 ~ file: directus.service.ts:52 ~ DirectusService ~ updateCollectionItemById ~ error:", { method: error?.parent?.config?.method, baseURL: error?.parent?.config?.baseURL, path: error?.parent?.config?.url, body: error?.parent?.config?.data, error: error?.response?.errors })
            this._getBadRequestError(error?.response?.errors);

        }
    }

}

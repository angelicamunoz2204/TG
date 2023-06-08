import { ExternalLodgingsAPIService } from "./externalLodgingsAPIService";
import { Input } from "../models/Input/input.model";
import { LodgingsDataHelper } from "../helpers/dataHelpers/lodgingsDataHelper";
import { LodgingsDatabase } from "../dataBase/lodgingsDatabase";

export class LodgingsService {
    externalLodgingsAPIService = new ExternalLodgingsAPIService();
    lodgingsDataHelper = new LodgingsDataHelper();
    lodgingsDatabase = new LodgingsDatabase();

    async getLodgings(requirements: Input) {
        const lodgingsFromAPI = await this.externalLodgingsAPIService.getLodgingsBetweenDates(requirements);
        await this.lodgingsDatabase.createLodgings(lodgingsFromAPI);
        const lodgingsPaths = await this.lodgingsDataHelper.createLodgingsPaths(lodgingsFromAPI);
        
        console.log(lodgingsFromAPI.length)
        return lodgingsPaths;     
    }

    getLodgingsSizes() {
        return [
            this.lodgingsDataHelper.amountOfLodgings,
            this.lodgingsDataHelper.largestAmountOfFeatures
        ];
    }
}
import { ExternalFlightsAPIService } from "./externalFlightsAPIService";
import { FlightsDatabase } from "../dataBase/flightsDatabase";
import { FlightsDataHelper } from "../helpers/dataHelpers/flightsDataHelper";
import { Input } from "../models/Input/input.model";

export class FlightsService {
    externalFlightsAPIService = new ExternalFlightsAPIService();
    flightsDatabase = new FlightsDatabase();
    flightsDataHelper = new FlightsDataHelper();

    async getFLights(requirements: Input) {
        const flightsFromAPI = await this.externalFlightsAPIService.getFlightsBetweenDates(requirements);
        await this.flightsDatabase.createFlights(flightsFromAPI[0],flightsFromAPI[1]);
        const flightsPaths = await this.flightsDataHelper.createFlightsPaths(flightsFromAPI[0],flightsFromAPI[1]);
        console.log(flightsFromAPI.length)
        
        return flightsPaths;
    }

    getFlightsSizes() {
        return [
            this.flightsDataHelper.amountOfDepartureFlights,
            this.flightsDataHelper.amountOfReturnFlights,
            this.flightsDataHelper.largestAmountOfDeparturePrices,
            this.flightsDataHelper.largestAmountOfReturnPrices,
            this.flightsDataHelper.maxAmountOfDepartureSegments,
            this.flightsDataHelper.maxAmountOfReturnSegments
        ];
    }

}
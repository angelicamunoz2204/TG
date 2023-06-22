import { ExternalFlightsAPIService } from './externalFlightsAPIService';
import { FlightsDatabase } from '../dataBase/flightsDatabase';
import { FlightsDataHelper } from '../helpers/dataHelpers/flightsDataHelper';
import { Input } from '../models/Input/input.model';

export class FlightsService {
	timeToGetFlights = 0;
	externalFlightsAPIService = new ExternalFlightsAPIService();
	flightsDatabase = new FlightsDatabase();
	flightsDataHelper = new FlightsDataHelper();

	async getFLights(requirements: Input) {
		const startTime = performance.now()
		
		const flightsFromAPI =
			await this.externalFlightsAPIService.getFlightsBetweenDates(requirements);

		const endTime = performance.now()
		const elapsedTime = endTime - startTime;
		this.timeToGetFlights = elapsedTime;

		await this.flightsDatabase.createFlights(
			flightsFromAPI[0],
			flightsFromAPI[1]
		);
		const flightsPaths = await this.flightsDataHelper.createFlightsPaths(
			requirements.adults,
			requirements.children,
			flightsFromAPI[0],
			flightsFromAPI[1]
		);

		return flightsPaths;
	}

	getFlightsSizes() {
		return [
			this.flightsDataHelper.amountOfDepartureFlights,
			this.flightsDataHelper.amountOfReturnFlights,
			this.flightsDataHelper.largestAmountOfDeparturePrices,
			this.flightsDataHelper.largestAmountOfReturnPrices,
			this.flightsDataHelper.maxAmountOfDepartureSegments,
			this.flightsDataHelper.maxAmountOfReturnSegments,
		];
	}
}

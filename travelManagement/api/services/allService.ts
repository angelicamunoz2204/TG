import { Input } from '../models/Input/input.model';
import { FlightsService } from './flightsService';
import { InputDataHelper } from '../helpers/dataHelpers/inputDataHelper';
import { MinizincHelper } from '../helpers/minizincHelpers/minizincHelper';
import { LodgingsService } from './lodgingsService';
export class AllService {
	flightsService = new FlightsService();
	lodgingsService = new LodgingsService();
	inputDataHelper = new InputDataHelper();
	minizincHelper = new MinizincHelper();

	async getAllSolutions(requirements: Input) {
		const flightsPaths = await this.flightsService.getFLights(requirements);
		const lodgingsPaths = await this.lodgingsService.getLodgings(requirements);

		const requirementsAmount = this.flightsService
			.getFlightsSizes()
			.concat(this.lodgingsService.getLodgingsSizes());
		const requiredInf = this.inputDataHelper.createRequiredInformation(
			requirements,
			requirementsAmount
		);
		const paths = requiredInf.concat(flightsPaths, lodgingsPaths);
		const allSolutions = await this.minizincHelper.getSolutions(paths);

		/* if(allSolutions.length > 0) {
            if (allSolutions.length > 3)
            return allSolutions.slice(0,3)
        } */
		return allSolutions;
	}
}

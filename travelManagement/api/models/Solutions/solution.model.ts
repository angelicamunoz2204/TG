import { flightSolutionModel } from './flightSolution.model';
import { lodgingSolutionModel } from './lodgingSolution.model';

export interface Solution {
	departure: flightSolutionModel;
	posPriceDeparture: number;
	return: flightSolutionModel;
	posPriceReturn: number;
	lodging: lodgingSolutionModel;
}

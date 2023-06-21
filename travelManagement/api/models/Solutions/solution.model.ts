import { FlightSolutionModel } from './flightSolution.model';
import { LodgingSolutionModel } from './lodgingSolution.model';

export interface Solution {
	maxBudget: number,
	amountSpent: number,
	amountSaved: number,
	totalScore: number,
	departureFlightsAmount: number,
	returnFlightsAmount: number,
	lodgingsAmount: number,
	departure: FlightSolutionModel;
	return: FlightSolutionModel;
	lodging: LodgingSolutionModel;
}

import { Request, Response } from 'express';
import { Input, defaults } from '../models/Input/input.model';
import { AllService } from '../services/allService';
import { Place } from '../models/Input/place.model';

const allService = new AllService();

const orig: Place = {
	IATA: 'CLO',
	name: 'Cali',
};

const dest: Place = {
	IATA: 'BOG',
	name: 'Bogota',
};
const inputData: Input = {
	origin: orig,
	destination: dest,
	startDate: new Date(2023, 7, 1),
	endDate: new Date(2023, 7, 5),
	startTime: [new Date(2023, 7, 1, 0, 0)],
	duration: 2,
	endTime: [new Date(2023, 7, 5, 23, 59)],
	adults: 2,
	children: 0,
	infants: 0,
	maxPrice: 2000,
	maxStops: 2,
	maxStopsDuration: 700,
	maxTotalDuration: 1000,
	allowAerolines: [0, 1, 2, 3, 4, 5, 6, 7],
	allowIntermediaries: true,
	bedrooms: 1,
	beds: 1,
	bathrooms: 1,
	isSuperHost: false,
	allowPolicies: [0, 1, 2, 3, 4],
	features: [], //TCO[4,5,8,12,33,47],
};

export async function sendAllInformation(req: Request, res: Response) {
	var requirements: Input = {
		...defaults,
		...req.body,
	};

	var tempDate = new Date(req.body.endDate);
	tempDate.setHours(23, 59, 0);
	console.log(requirements);

	requirements.startDate = new Date(req.body.startDate);
	requirements.endDate = new Date(req.body.endDate);
	requirements.startTime = [new Date(req.body.startDate)];
	requirements.endTime = [tempDate];
	const allSolutions = await allService.getAllSolutions(requirements);

	if (allSolutions.solution === 'Unsatisfiable') res.send(allSolutions);

	res.send(allSolutions);
}

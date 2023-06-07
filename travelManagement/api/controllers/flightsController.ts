import { Request, Response } from 'express';
import { Input, defaults } from '../models/Input/input.model';
import { Place } from '../models/Input/place.model';

const orig: Place = {
	IATA: "CLO",
	name: "Cali"
}

const dest: Place = {
	IATA: "TCO",
	name: "Tumaco"
}
const inputData: Input = {
	origin : orig,
	destination : dest,
	startDate: new Date(2023, 6, 1),
	endDate: new Date(2023, 6, 2),
	startTime: [new Date(2023, 6, 1, 0, 0)],
	duration: 1,
	endTime: [new Date(2023, 6, 5, 23, 59)],
	adults: 1,
	children: 0,
	infants: 0,
	maxPrice: 220,
	maxStops: 2,
	maxStopsDuration: 300,
	maxTotalDuration: 700,
	allowAerolines: [0, 1, 2, 3, 4, 5, 6, 7],
	allowIntermediaries: true,
	bedrooms: 1,
	beds: 1,
	bathrooms: 1,
	isSuperHost: false,
	allowPolicies: [0, 1, 2, 3, 4],
	features: [],
};

export async function sendFlightsInformation(req: Request, res: Response) {
	var requirements = {
		...defaults,
		...req.body,
	};
	/* const flightsPaths = await createFlightsPaths(requirements);
	const requiredInf = createRequiredInformation(requirements);
	const paths = requiredInf.concat(flightsPaths);
	const minizincDataName = minizincDataRequirements.concat(minizincDataFlights);
	const minizincDataLong = minizincDataRequirementsLong.concat(
		minizincDataFlightsLong
	);
	const minizincDataDim = minizincDataRequirementsDim.concat(
		minizincDataFlightsDim
	);
	createDznFile(paths, minizincDataName, minizincDataLong, minizincDataDim); */
	console.log(requirements);
	res.send('Ok flights');
}

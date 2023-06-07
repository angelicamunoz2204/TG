import { Place } from "./place.model";
export interface Input {
	origin: Place;
	destination: Place;
	startDate: Date;
	endDate: Date;
	duration: number;
	startTime: Date[];
	endTime: Date[];
	adults: number;
	children: number;
	infants: number;
	maxPrice: number;
	maxStops: number;
	maxStopsDuration: number;
	maxTotalDuration: number;
	allowAerolines: number[];
	allowIntermediaries: boolean;
	bedrooms: number;
	beds: number;
	bathrooms: number;
	isSuperHost: boolean;
	allowPolicies: number[];
	features: number[];
}

export const defaults: Pick<
	Input,
	| 'isSuperHost'
	| 'bathrooms'
	| 'beds'
	| 'bedrooms'
	| 'allowIntermediaries'
	| 'maxStops'
	| 'children'
	|  'infants'
	| 'duration'
	| 'maxStops'
	| 'maxStopsDuration'
	| 'maxTotalDuration'
	| 'allowAerolines'
	| 'allowPolicies'
	| 'features'
	| 'maxPrice'
> = {
	maxStops: 3,
	children: 0,
	infants: 0,
	duration: 3,
	maxStopsDuration: 300,
	maxTotalDuration: 700,
	allowAerolines: [1, 2, 3, 4, 5, 6, 7, 8],
	allowIntermediaries: true,
	bedrooms: 1,
	beds: 1,
	bathrooms: 1,
	isSuperHost: false,
	allowPolicies: [1, 2, 3, 4],
	features: [],
	maxPrice: 220,
};

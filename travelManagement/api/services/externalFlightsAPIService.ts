import axios from 'axios';
import { ExternalAPIsConnectionConstants } from '../constants/externalAPIs/externalAPIsConnectionConstants';
import { Input } from '../models/Input/input.model';
import { ExternalFlightsAPIParametersModel } from '../models/Params/externalFlightsAPIParameters.model';
import { setTimeout } from 'timers/promises';

export class ExternalFlightsAPIService {
	async getFlightsFromExternalAPI(params: ExternalFlightsAPIParametersModel) {
		const options = {
			method: 'GET',
			url: ExternalAPIsConnectionConstants.flightsExternalAPI.url,
			params: params,
			headers: ExternalAPIsConnectionConstants.flightsExternalAPI.headers,
		};

		const result = await this.getExternalApiInformation(options);
		//result.itineraries.results
		return result;
	}

	async getFlightsBetweenDates(req: Input) {
		let requirements = structuredClone(req);
		const start = requirements.startDate;
		const end = requirements.endDate;
		const duration = requirements.duration;
		const durationMils = duration * 1440 * 60000;

		const infants = requirements.infants;
		const children = requirements.children;

		let departureParams: ExternalFlightsAPIParametersModel = {
			adults: requirements.adults,
			origin: requirements.origin.IATA,
			destination: requirements.destination.IATA,
			departureDate: requirements.startDate.toISOString(),
			stops: '0,1,2',
			currency: 'COP',
			market: 'CO',
			locale: 'es-MX',
		};

		let returnParams: ExternalFlightsAPIParametersModel = {
			adults: requirements.adults,
			destination: requirements.origin.IATA,
			origin: requirements.destination.IATA,
			departureDate: requirements.startDate.toISOString(),
			stops: '0,1,2',
			currency: 'COP',
			market: 'CO',
			locale: 'es-MX',
		};

		if (infants > 0 || children > 0) {
			const kids = infants + children;
			if (kids <= 8) {
				this.createChildsInParams(departureParams, 0, infants, 1);
				this.createChildsInParams(departureParams, infants, kids, 10);
				this.createChildsInParams(returnParams, 0, infants, 1);
				this.createChildsInParams(returnParams, infants, kids, 10);
			}
		}

		let departureSegments: any[] = [];
		let returnSegments: any[] = [];
		let startTimes: any[] = [];
		let endTimes: any[] = [];

		while (end.getTime() - durationMils + 1440 * 60000 >= start.getTime()) {
			const rt = new Date(start);
			const h = new Date(rt.setDate(rt.getDate() + duration - 1));
			var startString = start.toISOString().slice(0, 10);
			var endString = h.toISOString().slice(0, 10);

			startTimes.push(startString);
			endTimes.push(endString);

			start.setDate(start.getDate() + 1);
		}

		if (startTimes.length + endTimes.length <= 60) {
			let statusDep = 'incomplete';
			let dep: any[] = [];
			let flag = false;
			let startTimePromises: Promise<any>[] = [];
			console.log('Starting departure flights');
			while (statusDep !== 'complete') {
				startTimePromises = [];
				startTimes.forEach((startTime) => {
					departureParams.departureDate = startTime;
					startTimePromises.push(
						this.getFlightsFromExternalAPI(departureParams)
					);
				});
				dep = await Promise.all(startTimePromises);
				statusDep = dep[0]?.context.status;
				if (statusDep === 'complete') break;
				await setTimeout(flag ? 10000 : 180000);
				flag = true;
			}
			departureSegments = dep.flatMap((obj: any) => obj.itineraries.results);
			console.log('Departure segments', departureSegments.length);
			let statusRet = 'incomplete';
			let ret: any[] = [];
			let flagRet = false;
			let endTimePromises: Promise<any>[] = [];
			console.log('Starting return flights');
			while (statusRet !== 'complete') {
				endTimePromises = [];
				endTimes.forEach((endTime) => {
					returnParams.departureDate = endTime;
					endTimePromises.push(this.getFlightsFromExternalAPI(returnParams));
				});
				ret = await Promise.all(endTimePromises);
				statusRet = ret[0]?.context.status;
				if (statusRet === 'complete') break;
				await setTimeout(flagRet ? 10000 : 180000);
				flagRet = true;
			}
			returnSegments = ret.flatMap((obj: any) => obj.itineraries.results);
			console.log('Return segments', returnSegments.length);
		}

		/* const MAX_ALLOWED_FLIGHTS = 30;
		if (startTimes.length + endTimes.length <= MAX_ALLOWED_FLIGHTS) {
			departureSegments = await getDataFromAPI(departureParams, startTimes);
			console.log('Departure segments', departureSegments.length);
			returnSegments = await getDataFromAPI(returnParams, endTimes);
			
		}
		async function getDataFromAPI(
			params: ExternalFlightsAPIParametersModel,
			dates: string[]
		): Promise<any> {
			let segments: any[] = [];
			let status = 'incomplete';
			let shouldWait = false;
			while (status !== 'complete') {
				let promises: Promise<any>[] = [];
				dates.forEach((date) => {
					params.departureDate = date;
					promises.push(this.getFlightsFromExternalAPI(params));
				});
				segments = await Promise.all(promises);
				status = segments[0].context.status;
				if (status === 'complete') break;
				await setTimeout(shouldWait ? 10000 : 180000);
				shouldWait = true;
			}
			return segments.flatMap((obj: any) => obj.itineraries.results);
		} */
		return [departureSegments, returnSegments];
	}

	createChildsInParams(
		params: ExternalFlightsAPIParametersModel,
		lower: number,
		upper: number,
		age: number
	) {
		for (let i = lower; i < upper; i++) {
			const str = ('childAge' +
				(i + 1)) as keyof ExternalFlightsAPIParametersModel;
			params[str] = age;
		}
	}

	getExternalApiInformation(query: Object): Promise<any> {
		return axios
			.request(query)
			.then((response: any) => response.data)
			.catch((error: Error) => {
				console.log('Error occurred while making API call:', error);
				throw error;
			});
	}
}

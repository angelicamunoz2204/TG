import axios from 'axios';
import { ExternalAPIsConnectionConstants } from '../constants/externalAPIs/externalAPIsConnectionConstants';
import { Input } from '../models/Input/input.model';
import { ExternalLodgingsAPIParametersModel } from '../models/Params/externalLodgingAPIParameters.model';
import { setTimeout } from 'timers/promises';

export class ExternalLodgingsAPIService {
	async getLodgingsFromExternalAPI(params: ExternalLodgingsAPIParametersModel) {
		const options = {
			method: 'GET',
			url: ExternalAPIsConnectionConstants.lodgingsExternalAPI.url,
			params: params,
			headers: ExternalAPIsConnectionConstants.lodgingsExternalAPI.headers,
		};

		var result = await this.getExternalApiInformation(options);
		// console.log('Testing', result);
		return result.results;
	}

	async getLodgingsBetweenDates(req: Input) {
		let requirements = structuredClone(req);
		const start = requirements.startDate;
		const end = requirements.endDate;
		let startTime = performance.now();
		const duration = requirements.duration;
		const durationMils = duration * 1440 * 60000;
		let lodgings: any[] = [];
		console.log('Starting lodgings');
		let flag = 0;
		while (end.getTime() - durationMils + 1440 * 60000 >= start.getTime()) {
			const rt = new Date(start);
			const h = new Date(rt.setDate(rt.getDate() + duration - 1));
			var startString = start.toISOString().slice(0, 10);
			var endString = h.toISOString().slice(0, 10);

			console.log(`Searching between ${startString} and ${endString}`);

			let pagination = 1;
			let lodgingParams: ExternalLodgingsAPIParametersModel = {
				location: requirements.destination.name,
				checkin: startString,
				checkout: endString,
				adults: requirements.adults,
				children: requirements.children,
				infants: requirements.infants,
				page: pagination,
				currency: 'USD',
			};
			let lodgs: any[] = [];
			let amountPage = 40;
			while (amountPage == 40 && pagination <= 8) {
				try {
					const lo = await this.getLodgingsFromExternalAPI(lodgingParams);
					if (lo.length === 0) {
						console.log('empty page, skipping');
						break;
					}
					amountPage = lo.length;
					lodgs = lodgs.concat(lo);
					pagination++;
					flag++;
					lodgingParams.page = pagination;

					const endTime = performance.now();
					const timeToFinish = endTime - startTime;
					console.log('elapsedTime', timeToFinish, 'calls', flag);
					console.log('cpm', timeToFinish / 1000 / flag);
					if (timeToFinish / 1000 / flag < 2) {
						console.log(
							'surpasing calls per minute speed with a speed of: ',
							timeToFinish / 1000 / flag,
							' calls per mintue'
						);
						await setTimeout(2000);
					}
				} catch (error) {
					await setTimeout(10000);
					startTime = performance.now();
				}
			}

			lodgings = lodgings.concat(lodgs);
			start.setDate(start.getDate() + 1);
		}

		return lodgings;
	}

	getExternalApiInformation(query: Object): Promise<any> {
		const promise = axios.request(query);
		const dataPromise = promise
			.then((response: any) => response.data)
			.catch((error: Error) => error);
		return dataPromise;
	}
}

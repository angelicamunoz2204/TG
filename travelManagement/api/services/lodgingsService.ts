import { ExternalLodgingsAPIService } from './externalLodgingsAPIService';
import { Input } from '../models/Input/input.model';
import { LodgingsDataHelper } from '../helpers/dataHelpers/lodgingsDataHelper';
import { LodgingsDatabase } from '../dataBase/lodgingsDatabase';

export class LodgingsService {
	timeToGetLodgings = 0;
	externalLodgingsAPIService = new ExternalLodgingsAPIService();
	lodgingsDataHelper = new LodgingsDataHelper();
	lodgingsDatabase = new LodgingsDatabase();

	async getLodgings(requirements: Input) {
		const startTime = performance.now()
		const lodgingsFromAPI =
			await this.externalLodgingsAPIService.getLodgingsBetweenDates(
				requirements
			);
			
		const endTime = performance.now()
		const elapsedTime = endTime - startTime;
		this.timeToGetLodgings = elapsedTime;

		const lodgingsWithDates = this.setDays(lodgingsFromAPI);
		await this.lodgingsDatabase.createLodgings(lodgingsWithDates);
		const lodgingsPaths = await this.lodgingsDataHelper.createLodgingsPaths(
			lodgingsWithDates
		);

		return lodgingsPaths;
	}

	setDays(lodgings: any[]) {
		let lodge: any = {};
		let datedLodges = [];

		for (let i = 0; i < lodgings.length; i++) {
			lodge = lodgings[i];
			const url = lodge.url;
			const urlLarg = url.length;
			const deeplink = lodge.deeplink;
			const start = deeplink.slice(urlLarg + 10, urlLarg + 20);
			const end = deeplink.slice(urlLarg + 31, urlLarg + 41);
			lodge.checkInDays = this.createDateDays(start);
			lodge.checkOutDays = this.createDateDays(end);

			datedLodges.push(lodge);
		}
		return datedLodges;
	}

	createDateDays(dat: string) {
		const firstDate = new Date('2023-01-01');
		const secondDate = new Date(dat);
		const sDateMinutes = secondDate.setUTCHours(0, 0, 0, 0) / 60000;
		const fDateMinutes = firstDate.setUTCHours(0, 0, 0, 0) / 60000;
		const days = (sDateMinutes - fDateMinutes) / 1440;

		return days;
	}

	getLodgingsSizes() {
		return [
			this.lodgingsDataHelper.amountOfLodgings,
			this.lodgingsDataHelper.largestAmountOfFeatures,
		];
	}
}

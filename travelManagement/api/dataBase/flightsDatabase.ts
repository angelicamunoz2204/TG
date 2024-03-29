import { Database } from './database';

export class FlightsDatabase {
	db = new Database('travelManagementDB');

	async createFlights(departureSegments: any[], returnSegments: any[]) {
		await this.db.connect();
		await this.db.deleteDocuments('departureFlights', {});
		await this.db.deleteDocuments('returnFlights', {});
		await this.db.insertDocuments('departureFlights', departureSegments);
		await this.db.insertDocuments('returnFlights', returnSegments);
	}

	async getFlightById(collectionName: string, id: string) {
		await this.db.connect();
		const flight = await this.db.findDocumentById(collectionName, id);
		return flight;
	}
}

import { Database } from './database';
export class LodgingsDatabase {
	db = new Database('travelManagementDB');

	async createLodgings(lodgings: any[]) {
		await this.db.connect();
		await this.db.deleteDocuments('lodgings', {});
		await this.db.insertDocuments('lodgings', lodgings);
		await this.db.close();
	}

	async getLodgingById(id: string, checkIn: number, checkOut: number) {
		await this.db.connect();
		const lod = await this.db.findDocuments('lodgings', {
			$and: [{ id: id }, { checkInDays: checkIn }, { checkOutDays: checkOut }],
		});

		await this.db.close();
		return lod[0];
	}
}

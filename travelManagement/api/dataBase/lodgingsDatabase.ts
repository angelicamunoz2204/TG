import { Database } from './database';
export class LodgingsDatabase {
	db = new Database('travelManagementDB');

	async createLodgings(lodgings: any[]) {
		await this.db.connect();
		await this.db.deleteDocuments('lodgings', {});
		await this.db.insertDocuments('lodgings', lodgings);
		await this.db.close();
	}

	async getLodgingById(id: string, pos: number) {
		const realPos = (pos + 1) % 300;
		const group = Math.floor((pos + 1) / 300);
		await this.db.connect();
		const lod = await this.db.findDocuments('lodgings', {
			$and: [{ id: id }, { position: realPos }],
		});
		if (lod.length === 1) return lod[0];
		// if (lod.length === 3) return lod[group];

		await this.db.close();
		return lod[0];
	}
}

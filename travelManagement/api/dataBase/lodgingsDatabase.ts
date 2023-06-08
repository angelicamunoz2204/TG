import { Database } from "./database";
export class LodgingsDatabase {

    db = new Database("travelManagementDB");

    async createLodgings(lodgings: any[]) {
        await this.db.connect();
        await this.db.insertDocuments("lodgings",lodgings);
    }

    async getLodgingById(id: string) {
        await this.db.connect();
        const lod = await this.db.findDocumentById("lodgings", id);
        return lod;
    }
}
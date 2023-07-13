import {
	MongoClient,
	Filter,
	Db,
	Collection,
	InsertOneResult,
	UpdateResult,
	DeleteResult,
	InsertManyResult,
} from 'mongodb';

import { DB } from './databaseConnection';
export class Database {
	private client?: MongoClient;
	private dbName: string;

	constructor(dbName: string) {
		this.dbName = dbName;
	}

	public async connect(): Promise<MongoClient> {
		try {
			this.client = await DB.Get();
		} catch (error) {
			console.error('Error al conectar a la base de datos', error);
		}
		return this.client!;
	}

	public getClient(): MongoClient {
		return this.client;
	}

	public getCollection<T extends Document>(
		collectionName: string
	): Collection<T> {
		const db: Db = this.client!.db(this.dbName);
		return db.collection<T>(collectionName);
	}

	public async insertDocument<T extends Document>(
		collectionName: string,
		document: any
	): Promise<InsertOneResult<T>> {
		const collection: Collection<T> = this.getCollection<T>(collectionName);
		return await collection.insertOne(document);
	}

	public async insertDocuments<T extends Document>(
		collectionName: string,
		documents: any[]
	): Promise<InsertManyResult<T>> {
		const collection: Collection<T> = this.getCollection<T>(collectionName);
		return await collection.insertMany(documents);
	}

	public async updateDocument<T extends Document>(
		collectionName: string,
		filter: object,
		update: any
	): Promise<UpdateResult> {
		const collection: Collection<T> = this.getCollection<T>(collectionName);
		return await collection.updateOne(filter, { $set: update });
	}

	public async deleteDocuments<T extends Document>(
		collectionName: string,
		filter: object
	): Promise<DeleteResult> {
		const collection: Collection<T> = this.getCollection<T>(collectionName);
		return await collection.deleteMany(filter);
	}

	public async findDocuments<T extends Document>(
		collectionName: string,
		filter: object
	): Promise<any[]> {
		const collection: Collection<T> = this.getCollection<T>(collectionName);
		return await collection.find(filter).toArray();
	}

	public async findDocumentById<T extends Document>(
		collectionName: string,
		id: string
	): Promise<any | null> {
		const collection: Collection<T> = this.getCollection<T>(collectionName);
		const filter: Filter<any> = { id: id };
		return await collection.findOne(filter);
	}

	public async close(x: string): Promise<void> {
		console.log('Cerrando conexión a db', x);
		try {
			await this.client!.close();
		} catch {
			console.log('Error cerrando conexión', x);
		}
	}
}

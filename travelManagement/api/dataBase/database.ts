import { MongoClient, Filter, Db, Collection, InsertOneResult, UpdateResult, DeleteResult, ObjectId, InsertManyResult } from 'mongodb';
import { DatabaseConnection } from './databaseConnection';
export class Database {
  private client: MongoClient;
  private dbName: string;
  databaseConnection = new DatabaseConnection()
  
  constructor(dbName: string){
    this.dbName = dbName
  }

  public async connect(): Promise<MongoClient> {
    try {
      this.client = await this.databaseConnection.connect();
      console.log('Conectado a la base de datos');
    } catch (error) {
      console.error('Error al conectar a la base de datos', error);
    }
    return this.client;
  }

  public getCollection<T>(collectionName: string): Collection<T> {
    const db: Db = this.client.db(this.dbName);
    return db.collection<T>(collectionName);
  }

  public async insertDocument<T>(collectionName: string, document: any): Promise<InsertOneResult<T>> {
    const collection: Collection<T> = this.getCollection<T>(collectionName);
    return await collection.insertOne(document);
  }

  public async insertDocuments<T>(collectionName: string, documents: any[]): Promise<InsertManyResult<T>> {
    const collection: Collection<T> = this.getCollection<T>(collectionName);
    return await collection.insertMany(documents);
  }

  public async updateDocument<T>(collectionName: string, filter: object, update: any): Promise<UpdateResult> {
    const collection: Collection<T> = this.getCollection<T>(collectionName);
    return await collection.updateOne(filter, { $set: update });
  }

  public async deleteDocument<T>(collectionName: string, filter: object): Promise<DeleteResult> {
    const collection: Collection<T> = this.getCollection<T>(collectionName);
    return await collection.deleteOne(filter);
  }

  public async findDocuments<T>(collectionName: string, filter: object): Promise<any[]> {
    const collection: Collection<T> = this.getCollection<T>(collectionName);
    return await collection.find(filter).toArray();
  }

  public async findDocumentById<T>(collectionName: string, id: string): Promise<any | null> {
    const collection: Collection<T> = this.getCollection<T>(collectionName);
    const filter: Filter<any> = { "id": id};
    return await collection.findOne(filter);
  }

  public async close(): Promise<void> {
    await this.client.close();
    console.log('Conexión cerrada');
  }
}

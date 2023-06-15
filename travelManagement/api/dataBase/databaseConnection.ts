import { MongoClient } from 'mongodb';

export class DatabaseConnection {
	async connect() {
		const uri = 'mongodb+srv://user:user@cluster0.twxiuvy.mongodb.net/';
		const dbName = 'travelManagementDB';

		const client = new MongoClient(uri);

		try {
			await client.connect();
			console.log('Conectado a la base de datos');
			return client;
		} catch (error) {
			console.error('Error al conectar a la base de datos', error);
		}
	}
}

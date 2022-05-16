import * as mongoDB from 'mongodb';

export class DataBaseServices {
	mongoClient: mongoDB.MongoClient;
	db: mongoDB.Db;

	constructor() {
		try {
			this.mongoClient = new mongoDB.MongoClient(
				process.env.MONGODB_URI || 'localhost'
			);
			this.db = this.mongoClient.db('socialbooks');
		} catch (e) {
			console.error(e);
			throw new Error(`deu ruim DataBaseServices`);
		}
	}

	async connect() {
		console.log(`mongoDB Connected`);
		await this.mongoClient.connect();
	}

	async disconnect() {
		console.log(`mongoDB Disconnected`);
		await this.mongoClient.close();
	}

	async findOne(query: Object, collectionName: string) {
		console.log(`find one generic`);
		return this.db.collection(collectionName).findOne(query);
	}

	async findAny(query: Object, collection: string) {
		console.log(`find generic`);
		return this.db.collection(collection).find(query).toArray();
	}

	async insertOne(document: Object, collection: string) {
		return this.db.collection(collection).insertOne(document);
	}

	async updateOne(query: Object, newValues: Object, collection: string) {
		return this.db.collection(collection).updateOne(query, newValues);
	}

	async deleteOne(query: Object, collection: string) {
		return this.db.collection(collection).deleteOne(query);
	}

	async deleteMany(query: Object, collection: string) {
		return this.db.collection(collection).deleteMany(query);
	}

	// TODO create method to return query = { _id:mongoID}
	mongoIDHandler(id?: string) {
		if (id) {
			if (mongoDB.ObjectId.isValid(id)) {
				return new mongoDB.ObjectId(id);
			} else {
				return null;
			}
		} else {
			return new mongoDB.ObjectId();
		}
	}
}

//To-Do Factory
// export interface DBServicesFactory {
// 	mongoClient: mongoDB.MongoClient;
// 	db: mongoDB.Db;

// 	connect(): Promise<void>;

// 	disconnect(): Promise<void>;

// 	findOne(query: Object,collectionName: string): Promise<mongoDB.WithId<mongoDB.Document>>;

// 	findAny(query: Object,collection: string): Promise<mongoDB.WithId<mongoDB.Document>[]>;

// 	insertOne(document: Object,collection: string): Promise<mongoDB.InsertOneResult<mongoDB.Document>>;

// 	updateOne(query: Object,newValues: Object,collection: string): Promise<mongoDB.UpdateResult>;

// 	deleteOne(query: Object, collection: string): Promise<mongoDB.DeleteResult>;

// 	deleteMany(query: Object, collection: string): Promise<mongoDB.DeleteResult>;

// 	mongoIDHandler(id?: string): mongoDB.ObjectId | null;
// }

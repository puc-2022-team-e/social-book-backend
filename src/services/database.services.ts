import * as mongoDB from 'mongodb';
export class DataBaseServices {
	mongoClient: mongoDB.MongoClient;
	db: mongoDB.Db;

	constructor(mongoURI:string){
		try {
			this.mongoClient = new mongoDB.MongoClient(mongoURI);
			this.db = this.mongoClient.db('socialbooks');
		} catch (e) {
			console.error(e);
			throw new Error(`deu ruim DataBaseServices`);
		}
	}

	async connect(){
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
	
	async queryBuilder(id: any){
        var query = {};
        if(id){
            const mongoId = this.mongoIDHandler(id);
            if (mongoId) {
                query = {
                    $or: [{ short: id }, { _id: mongoId }],
                };
            } else {
                query = {
                    short: id,
                };
            }
        }
        return query;
    }

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
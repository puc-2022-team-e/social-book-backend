import * as mongoDB from 'mongodb';

const BOOKS_COLLECTION_NAME = 'books';
const DISCUSSIONS_COLLECTION_NAME = 'discussions';
const COMMENTARIES_COLLECTION_NAME = 'commentaries';

export const collections: {
	books?: mongoDB.Collection;
	discussions?: mongoDB.Collection;
	commentaries?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
	// console.log(process.env.MONGODB_URI)
	const client: mongoDB.MongoClient = new mongoDB.MongoClient(
		process.env.MONGODB_URI || ''
	);
	await client.connect();

	const db: mongoDB.Db = client.db(process.env.DB_NAME || 'socialbooks');

	console.log(collections);
	// books
	const booksCollection: mongoDB.Collection = db.collection(
		BOOKS_COLLECTION_NAME
	);
	collections.books = booksCollection;

	// discussions
	const discussionsCollection: mongoDB.Collection = db.collection(
		DISCUSSIONS_COLLECTION_NAME
	);
	collections.discussions = discussionsCollection;

	// commentaries
	const commentariesCollection: mongoDB.Collection = db.collection(
		COMMENTARIES_COLLECTION_NAME
	);
	collections.commentaries = commentariesCollection;
}

export class DataBaseServices {
	mongoClient: mongoDB.MongoClient;
	db: mongoDB.Db;
	booksCollection: mongoDB.Collection;
	discussions: mongoDB.Collection;
	comments: mongoDB.Collection;

	constructor(url: string, dataBaseName: string) {
		try {
			console.log(`mongoURL: ${url}`);
			this.mongoClient = new mongoDB.MongoClient(url);
			this.db = this.mongoClient.db(dataBaseName);
			this.booksCollection = this.db.collection(BOOKS_COLLECTION_NAME);
			this.discussions = this.db.collection(DISCUSSIONS_COLLECTION_NAME);
			this.comments = this.db.collection(COMMENTARIES_COLLECTION_NAME);
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

	async findBook(idName?: string) {
		if (idName) {
			console.log(`Searching Book by id/short ${idName}`);
			try {
				var query;

				if (mongoDB.ObjectId.isValid(idName)) {
					const mongoId = new mongoDB.ObjectId(idName);
					query = {
						$or: [{ short: idName }, { _id: mongoId }],
					};
				} else {
					query = { short: idName };
				}

				return this.booksCollection.findOne(query);
			} catch (e) {
				console.log(e);
			}
		} else {
			console.log(`searching all books`);
			return this.booksCollection.find().toArray();
		}
	}

	async findDiscussion(id?:string){

		if (id){
			console.log(`searching discussion by id ${id}`);
			try{
				if (mongoDB.ObjectId.isValid(id)){
					const mongoId = new mongoDB.ObjectId(id);
					return this.discussions.findOne({_id: mongoId})
				}else{
					return {message: "invalid ID"}
				}
			}catch(e){
				console.error(e);
				throw new Error(`deu searching discussion by id`)
			}
		}else{
			return this.discussions.find().toArray()
		}
	}
}

import * as mongoDB from 'mongodb';

export const collections: { books?: mongoDB.Collection} = {}

export async function connectToDatabase(collection:string) {
	const client: mongoDB.MongoClient = new mongoDB.MongoClient(
		process.env.MONGODB_URI || ''
	);
	await client.connect();

	const db: mongoDB.Db = client.db(process.env.DB_NAME || "socialbooks");

	const booksCollection: mongoDB.Collection = db.collection(collection);
	
	collections.books = booksCollection;

	console.log(
		`Successfully connected to database: ${db.databaseName} and collection: ${booksCollection.collectionName}`
	);
}

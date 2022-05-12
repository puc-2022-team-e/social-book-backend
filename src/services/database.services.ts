import * as mongoDB from 'mongodb';

export const collections: { books?: mongoDB.Collection, 
	discussons?: mongoDB.Collection,
	commentaries?: mongoDB.Collection} = {}

export async function connectToDatabase(collection:string) {

	const client: mongoDB.MongoClient = new mongoDB.MongoClient(
		process.env.MONGODB_URI || ''
	);
	await client.connect();

	const db: mongoDB.Db = client.db(process.env.DB_NAME || "socialbooks");

	// books
	const booksCollection: mongoDB.Collection = db.collection(collection);
	collections.books = booksCollection;

	// discussions
	const discussionsCollection: mongoDB.Collection = db.collection(collection);
	collections.discussons = discussionsCollection;

	// commentaries
	const commentariesCollection: mongoDB.Collection = db.collection(collection);
	collections.commentaries = commentariesCollection;

	console.log(`Successfully connected to database: ${db.databaseName}`);
}

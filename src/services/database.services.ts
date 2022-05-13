import * as mongoDB from 'mongodb';

const BOOKS_COLLECTION_NAME = 'books'
const DISCUSSIONS_COLLECTION_NAME = 'discussions'
const COMMENTARIES_COLLECTION_NAME = 'commentaries'


export const collections: { books?: mongoDB.Collection, 
	discussons?: mongoDB.Collection,
	commentaries?: mongoDB.Collection} = {}

export async function connectToDatabase() {

	// console.log(process.env.MONGODB_URI)
	const client: mongoDB.MongoClient = new mongoDB.MongoClient(
		"mongodb+srv://teame:LDQy8j4gpt8c5dQ@puces22teame.7ss80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	);
	await client.connect();

	const db: mongoDB.Db = client.db(process.env.DB_NAME || "socialbooks");

	console.log(collections)
	// books
	const booksCollection: mongoDB.Collection = db.collection(BOOKS_COLLECTION_NAME);
	collections.books = booksCollection;

	// discussions
	const discussionsCollection: mongoDB.Collection = db.collection(DISCUSSIONS_COLLECTION_NAME);
	collections.discussons = discussionsCollection;

	// commentaries
	const commentariesCollection: mongoDB.Collection = db.collection(COMMENTARIES_COLLECTION_NAME);
	collections.commentaries = commentariesCollection;


	console.log(`Successfully connected to database: ${db.databaseName}`);
}

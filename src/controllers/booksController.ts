import { Response, Request } from 'express';
import { collections, connectToDatabase } from '../services/database.services';

const COLLECTION_NAME = 'books';
const ERROR_MSG = 'internal server Error';
class BooksController {
	static async getBookById(req: Request, res: Response) {
		const id = req?.params?.id;

		await connectToDatabase(COLLECTION_NAME);
		console.log('getting by ID');
		try {
			console.log(`Getting book ID: ${id}`);
			const query = { short: id };
			const book = await collections.books?.findOne(query);
			console.log(`book
				${book}
			`);
			if (book) {
				res.status(200).send(book);
			} else {
				console.log('not found');
				res.status(404).send(`book ${id} not found`);
			}
		} catch (error) {
			res.status(500).send(ERROR_MSG);
		}
	}

	static async getAllBooks(req: Request, res: Response) {
		await connectToDatabase(COLLECTION_NAME);
		try {
			const book = await collections.books?.find().toArray();

			if (book) {
				res.status(200).send(book);
			} else {
				res.status(404).send(`not found`);
			}
		} catch (error) {
			res.status(500).send(ERROR_MSG);
		}
	}

	static async postBook(req: Request, res: Response) {
		const book = req.body;

		if (book) {
			console.log(`New book: ${book}`);
			try {
				await connectToDatabase(COLLECTION_NAME);
				console.log('adding book');
				const ret = await collections.books?.insertOne(book);
				res.status(201).send({
					status: 'success',
					id: ret?.insertedId,
				});
			} catch (error) {
				res.status(500).send(ERROR_MSG);
			}
		}
	}

	static async updateBook(req: Request, res: Response) {
		const values = req?.body;

		const id = req?.params?.id;

		if (id && values) {
			console.log(`Updating book ${id}`);
			try {
				const query = { short: id };
				const newValues = { $set: values };

				await connectToDatabase(COLLECTION_NAME);
				const ret = await collections.books?.updateOne(query, newValues);

				if (ret?.modifiedCount && ret?.modifiedCount > 0) {
					res.status(200).send({
						status: 200,
						message: `Document ${id} successfully updated`,
					});
				} else {
					throw new Error(`Error while trying to update book ${id}`);
				}
			} catch (error) {
				console.error(error);
				res.status(500).send({
					status: 500,
					message: ERROR_MSG,
					error: error,
				});
			}
		} else {
			res.status(500).send({
				status: 500,
				message: ERROR_MSG + ` Missing Body or ID`,
			});
		}
	}

	static async deleteBook(req: Request, res: Response) {
		//to-do delete by mongo _id: query = {ObjectId(id)}
		const id = req?.params?.id;
		console.log(`deleting book: ${id}!`);
		if (id) {
			try {
				const query = { short: id };
				const ret = await collections.books?.deleteOne(query);
				if (ret?.deletedCount === 1) {
					res.status(200).send({
						status: 200,
						message: `deleted: ${ret?.deletedCount}`,
					});
				} else {
					throw new Error(`Cant delete item ${id}`);
				}
			} catch (error) {
				res.status(500).send({
					status: 500,
					message: error,
				});
			}
		} else {
			res.status(500).send({
				status: 500,
				message: ERROR_MSG + ` Missing ID`,
			});
		}
	}
}
export default BooksController;

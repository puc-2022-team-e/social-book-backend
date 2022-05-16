import { Response, Request } from 'express';
import { DataBaseServices } from '../services/database.services';

const ERROR_MSG = 'internal server Error';
const dataBase = new DataBaseServices()
class BooksController {
	static collection = 'books';
	static async getBooks(req: Request, res: Response) {
		const id = req?.params?.id;

		try {
			await dataBase.connect();
			var books;
			var query = {};
			if (id) {

				query = this.queryBuilder(id);

				books = await dataBase.findOne(query, this.collection);
			} else {
				books = await dataBase.findAny(query, this.collection);
			}
			await dataBase.disconnect();

			if (!books) {
				res.status(404).send(`book ${id} not found`);
			} else {
				res.status(200).send(books);
			}
		} catch (e) {
			console.error(e);
			await dataBase.disconnect();
			res.status(500).send(ERROR_MSG);
		}
	}

	static async postBook(req: Request, res: Response) {
		const book = req.body;

		if (book) {
			console.log(`New book: ${book}`);
			try {
				await dataBase.connect();
				const ret = await dataBase.insertOne(book, this.collection);
				await dataBase.disconnect();
				res.status(201).send({
					status: 'success',
					id: ret?.insertedId,
				});
			} catch (e) {
				console.error(e);
				res.status(500).send(ERROR_MSG);
			}
		} else {
			res.status(500).send({
				error: ERROR_MSG,
				message: 'invalid request body; Body must be a book object',
			});
		}
	}

	static async updateBook(req: Request, res: Response) {
		const values = req?.body;

		const id = req?.params?.id;

		if (id && values) {
			console.log(`Updating book ${id}`);
			try {
				const query = this.queryBuilder(id);

				const newValues = { $set: values };

				await dataBase.connect();

				const ret = await dataBase.updateOne(query, newValues, this.collection);

				await dataBase.disconnect();

				if (ret?.modifiedCount && ret?.modifiedCount > 0) {
					res.status(200).send({
						status: 200,
						message: `Document ${id} successfully updated`,
					});
				} else {
					throw new Error(`Error while trying to update book ${id}`);
				}
			} catch (e) {
				console.error(e);
				res.status(500).send({
					status: 500,
					message: ERROR_MSG,
					error: e,
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
		const id = req?.params?.id;
		console.log(`deleting book: ${id}!`);
		if (id) {
			try {
				await dataBase.connect();
				
				const query = this.queryBuilder(id);

				const ret = await dataBase.deleteOne(query,this.collection);
				await dataBase.disconnect();
				if (ret?.deletedCount === 1) {
					res.status(200).send({
						status: 200,
						message: `deleted: ${ret?.deletedCount}`,
					});
				} else {
					throw new Error(`Cant delete item ${id}`);
				}
			} catch (e) {
				res.status(500).send({
					status: 500,
					message: e,
				});
			}
		} else {
			res.status(500).send({
				status: 500,
				message: ERROR_MSG + ` Missing ID`,
			});
		}
	}

	static queryBuilder(id:string):Object{
		var bookQuery = {}
		const mongoId = dataBase.mongoIDHandler(id);
		if (mongoId) {
			bookQuery = {
				$or: [{ short: id }, { _id: mongoId }],
			};
		} else {
			bookQuery = {
				short: id,
			};
		}
		return bookQuery;
	}
}
export default BooksController;

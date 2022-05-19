import { Response, Request } from 'express';
import BookRepository from '../services/database/repository/bookRepository';

const ERROR_MSG = 'internal server Error';
const COLLECTION = 'books';
class BooksController {

	private static bookRepository = new BookRepository();
	
	static async getBooks(req: Request, res: Response) {
		const id = req?.params?.id;

		try {
			var books;
			var query = {};
			
			if (id) {
				console.log(`getBooks-> id: ${id}`)
				query = await BooksController.bookRepository.queryBuilder(id);
			}

			books = await BooksController.bookRepository.findAny(query, COLLECTION);

			if (!books) {
				res.status(404).send(`book ${id} not found`);
			} else {
				res.status(200).send(books);
			}
		} catch (e) {
			console.error(e);
			res.status(500).send(ERROR_MSG);
		}
	}

	static async postBook(req: Request, res: Response) {
		const book = req.body;
		console.log( `adding new book`)
		if (book) {
			console.log(`New book: ${book}`);
			try {
				const ret = await BooksController.bookRepository.insertOne(book, COLLECTION);
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
				const query = await BooksController.bookRepository.queryBuilder(id);

				const newValues = { $set: values };
				const ret = await BooksController.bookRepository.updateOne(query, newValues, COLLECTION);
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
				const query = await BooksController.bookRepository.queryBuilder(id);
				const ret = await BooksController.bookRepository.deleteOne(query, COLLECTION);
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

	static async searchBookByString(req: Request, res: Response) {
		console.log(`seaching by query pattern`)
		const pattern = req.query.q;
		console.log(`pattern: ${pattern}`)
		if (pattern) {
			const query = { $text: { $search: pattern } };
			console.log(`query: ${query}`)
			console.log(`collection ${COLLECTION}`)
			const books = await BooksController.bookRepository.findAny(query, COLLECTION);
			res.status(200).send(books);
		} else {
			res.status(404).send({});
		}
	}
}
export default BooksController;

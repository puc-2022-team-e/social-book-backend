import { DataBaseServices } from '../database.services';
import { ApiResponse } from '../api.response.interface';
import Services from '../service.interface';
import BookValidator from '../book/book.validator'
import BooksInterface from './book.interface';

export class BooksServices implements Services {
	db: DataBaseServices;
	collection: string;
	bookValidator:BookValidator;
	constructor(db: DataBaseServices) {
		this.db = db;
		this.collection = 'books';
		this.bookValidator = new BookValidator();
	}

	async getBooks(bookId?: string): Promise<ApiResponse> {
		var query = {};
		var books;
		var mongoStatusCode = 200;
		try {
			if (bookId) {
				query = await this.db.queryBuilder(bookId);
			}

			books = await this.db.findAny(query, this.collection);
			if (bookId && books.length === 0) {
				mongoStatusCode = 404;
				books = [];
			}
		} catch (e) {
			// console.error(e);
			mongoStatusCode = 500;
		}
		return { statusCode: mongoStatusCode, body: books || [] };
	}

	async updateBook(bookId: string, values: Object): Promise<ApiResponse> {
		var mongoStatusCode = 404;
		var responseBody = {};
		try {
			const newValues = { $set: values };
			const query = await this.db.queryBuilder(bookId);
			const ret = await this.db.updateOne(query, newValues, this.collection);

			if (ret?.modifiedCount && ret?.modifiedCount > 0) {
				(mongoStatusCode = 200),
					(responseBody = {
						status: mongoStatusCode,
						message: `Document ${bookId} successfully updated`,
					});
			}
		} catch (e) {
			//console.error(e);
			mongoStatusCode = 500;
		}
		return { statusCode: mongoStatusCode, body: responseBody };
	}

	async postBook(book: Object): Promise<ApiResponse> {
		var mongoStatusCode = 404;
		var responseBody = {};
		try {
			//try to cast the post object as a Book Object
			var validBook = <BooksInterface> book
			var hasProblems = this.bookValidator.validate(validBook)
			if (Object.keys(hasProblems).length === 0){
				const ret = await this.db.insertOne(book, this.collection);
				if (ret?.insertedId) {
					mongoStatusCode = 201;
					responseBody = {
						status: 'success',
						id: ret?.insertedId,
					};
				}
			}else{
				mongoStatusCode = 500;
				responseBody = hasProblems;
			}
		} catch (e) {
			//console.error(e);
			mongoStatusCode = 500
		}

		return { statusCode: mongoStatusCode, body: responseBody };
	}

	async deleteBook(bookId: string): Promise<ApiResponse> {
		var mongoStatusCode = 404;
		var responseBody = {};
		var query = {};

		try {
			if (bookId) {
				query = await this.db.queryBuilder(bookId);
			}

			const deleted = await this.db.deleteOne(query, this.collection);
			if (deleted.deletedCount === 1) {
				mongoStatusCode = 200;
				responseBody = {
					status: 200,
					message: `deleted: ${deleted?.deletedCount}`,
				};
			}
		} catch (e) {
			//console.error(e);
			mongoStatusCode = 500;
		}

		return { statusCode: mongoStatusCode, body: responseBody };
	}
}

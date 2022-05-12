import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import { collections, connectToDatabase } from '../services/database.services';

class BooksController {

	static async getBookById(req: Request, res: Response) {
		const id = req?.params?.id;
		await connectToDatabase();

		try {
			const query = { _id: new ObjectId(id) };
			const book = await collections.books?.findOne(query);
			if (book) {
				res.status(200).send(book);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to find any document`
				);
		}
	}

	static async getAllBooks(req: Request, res: Response) {
		await connectToDatabase();
		try {
			const book = await collections.books?.find().toArray();
			if (book) {
				res.status(200).send(book);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to find match matching document with id: ${req.params.id} `
				);
		}
	}
}
export default BooksController;

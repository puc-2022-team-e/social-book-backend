import books from '../data/books';
import { Response, Request } from 'express';
class BooksController {
	static getAllBooks(req: Request, res: Response) {
		return res.status(200).json({
			books,
			message: 'all books',
		});
	}

	static getBookById(req: Request, res: Response) {
		const book = books.find(({ _id }) => _id === req.params.id) || {};
		return res.status(200).json({book});
	}
}
export default BooksController;

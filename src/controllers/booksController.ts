import books from '../data/books';
import { Response, Request } from 'express';
class BooksController {
	static getAllBooks(req: Request, res: Response) {
		return res.status(200).json({
			books,
			message: 'all books',
		});
	}
}
export default BooksController;

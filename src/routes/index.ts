import { Router } from 'express';
import BooksController from '../controllers/booksController';
import auth from '../middleware/auth';

const routes = Router();

routes.get('/b', auth, BooksController.getAllBooks);
routes.get('/b/:id', auth, BooksController.getBookById);
routes.post('/b/new', auth, BooksController.postBook);
routes.put('/b/update/:id',auth, BooksController.updateBook);
routes.delete('/b/delete/:id', auth, BooksController.deleteBook);

export default routes;

import { Router } from "express";
import BooksController from "../controllers/booksController";
import auth from '../middleware/auth';

const routes = Router();

routes.get("/b", auth, BooksController.getAllBooks);
routes.get("/b/:id", auth,BooksController.getBookById);
export default routes;
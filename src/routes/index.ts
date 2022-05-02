import { Router } from "express";
import BooksController from "../controllers/booksController";
import auth from '../middleware/auth';

const routes = Router();

routes.get("/b", auth, BooksController.getAllBooks);

export default routes;
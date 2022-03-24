import { Router } from "express";
import BooksController from "../controllers/booksController";

const routes = Router();

routes.get("/b", BooksController.getAllBooks);

export default routes;

import { Router } from "express";
import CommentariesController from "../controllers/commentariesController";
import DiscussionsController from "../controllers/discussionsController";
import BooksController from '../controllers/booksController';

import auth from '../middleware/auth';

const routes = Router();

//books 
routes.get('/b', auth, BooksController.getAllBooks);
routes.get('/b/:id', auth, BooksController.getBookById);
routes.post('/b/new', auth, BooksController.postBook);
routes.put('/b/update/:id',auth, BooksController.updateBook);
routes.delete('/b/delete/:id', auth, BooksController.deleteBook);

//discussions
routes.get("/d", auth, DiscussionsController.getAllDiscussions);
routes.post("/d", auth, DiscussionsController.insertDiscussion);
routes.post("/d/:id", auth, DiscussionsController.deleteDiscussionById);

// comentaries
routes.get("/c/:idDiscussion", auth, CommentariesController.getAllCommentariesByIdDiscussion);
routes.post("/c", auth, CommentariesController.insertComentary);
routes.post("/c/:id", auth, CommentariesController.deleteComentaryById);

export default routes;


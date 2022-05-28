
import { Router } from "express";
import CommentariesController from "../controllers/commentariesController";
import DiscussionsController from "../controllers/discussionsController";
import BooksController from '../controllers/booksController';
import UsersController from "../controllers/usersController";

import auth from '../middleware/auth';

const routes = Router();

//books 
routes.get('/b', auth, BooksController.getBooks);
routes.get('/b/:id', auth, BooksController.getBooks);
routes.get('/search/', auth,BooksController.searchBookByString);
routes.post('/b', auth, BooksController.postBook);
routes.put('/b/:id',auth, BooksController.updateBook);
routes.delete('/b/:id', auth, BooksController.deleteBook);

//discussions
routes.get("/d", auth, DiscussionsController.getDiscussions);
routes.get("/d/:id", auth, DiscussionsController.getDiscussions);
routes.post("/d", auth, DiscussionsController.postDiscussions);
routes.put("/d/:id", auth, DiscussionsController.updateDiscussion);
routes.delete("/d/:id", auth, DiscussionsController.deleteDiscussion);

// commentaries
routes.get("/c/:discussionid", auth, CommentariesController.getAllCommentariesByIdDiscussion);
routes.get("/c/:commentaryid", auth, CommentariesController.getSingleCommentary)
routes.post("/c", auth, CommentariesController.insertCommentary);
routes.delete("/c/:commentaryid", auth, CommentariesController.deleteCommentaryById);

// users 
routes.post("/u", auth, UsersController.postUser);
routes.get("/u/new-user/:email", auth, UsersController.getUserByEmail);
routes.put("/u/:id", auth, UsersController.updateUser);



export default routes;


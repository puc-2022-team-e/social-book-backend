
// import { Router } from "express";
// import auth from '../middleware/auth';
// import healthCheck from "../middleware/healthCheck";
// const routes = Router();

// //ping
// routes.get(`/ping`, healthCheck);

//books 
// routes.get('/b', auth, BooksController.getBooks);
// routes.get('/b/:id', auth, BooksController.getBooks);
// routes.get('/search/', auth,BooksController.searchBookByString);
// routes.post('/b', auth, BooksController.postBook);
// routes.put('/b/:id',auth, BooksController.updateBook);
// routes.delete('/b/:id', auth, BooksController.deleteBook);

// //discussions
// routes.get("/d", auth, DiscussionsController.getDiscussions);
// routes.get("/d/:id", auth, DiscussionsController.getDiscussions);
// routes.post("/d", auth, DiscussionsController.postDiscussions);
// routes.put("/d/:id", auth, DiscussionsController.updateDiscussion);
// routes.delete("/d/:id", auth, DiscussionsController.deleteDiscussion);

// // comentaries
// routes.get("/c/:discussionid", auth, CommentariesController.getAllCommentariesByIdDiscussion);
// routes.get("/c/:commentaryid", auth, CommentariesController.getSingleCommentary)
// routes.post("/c", auth, CommentariesController.insertCommentary);
// routes.delete("/c/:commentaryid", auth, CommentariesController.deleteCommentaryById);

// export default routes;

import express from 'express';
import healthCheck from '../middleware/healthCheck';
import { DataBaseServices } from '../services/database.services';
import { booksRouter } from './router.books';
import { discussionRouter } from './router.discussion';

export const mainRouter = (dbService:DataBaseServices)=>{
	const router = express.Router();

	router.get('/ping', healthCheck);

	router.use('/b', booksRouter(dbService));

	router.use('/d', discussionRouter(dbService));

	return router;
}
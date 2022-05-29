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
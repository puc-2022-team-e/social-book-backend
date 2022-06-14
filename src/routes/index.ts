import express from 'express';
import healthCheck from '../middleware/healthCheck';
import { DataBaseServices } from '../services/database.services';
import { booksRouter } from './router.books';
import { commentaryRouter } from './router.commentary';
import { discussionRouter } from './router.discussion';
import { userRouter } from './router.user';
import { searchRouter } from './router.omnisearch';

export const mainRouter = (dbService: DataBaseServices) => {
	const router = express.Router();

	router.get('/ping', healthCheck);

	router.use('/b', booksRouter(dbService));

	router.use('/d', discussionRouter(dbService));

	router.use('/c', commentaryRouter(dbService));

	router.use('/u', userRouter(dbService));

	router.use('/search', searchRouter(dbService));

	return router;
};

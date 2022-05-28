import express, { Response, Request } from 'express';
import auth from '../middleware/auth';
import { DataBaseServices } from '../services/database.services';
import { DiscussionServices } from '../services/discussion/discussion.service';
const router = express.Router();

export const discussionRouter = (db: DataBaseServices) => {
	const discussionService = new DiscussionServices(db);

	router.get('/', auth, async (req: Request, res: Response) => {
		const response = await discussionService.getDiscussions();
		res.status(response.statusCode).send(response.body);
	});

	return router;
};

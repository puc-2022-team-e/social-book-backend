import express, { Response, Request } from 'express';
import auth from '../middleware/auth';
import { CommentaryServices } from '../services/commentary/commentary.service';
import { DataBaseServices } from '../services/database.services';
import { DiscussionServices } from '../services/discussion/discussion.service';
const router = express.Router();

export const discussionRouter = (db: DataBaseServices) => {
	const discussionService = new DiscussionServices(db);
	const commentaryService = new CommentaryServices(db);

	router.get('/', auth, async (req: Request, res: Response) => {
		const response = await discussionService.getEntity();
		res.status(response.statusCode).send(response.body);
	});

	router.get('/:id', auth, async (req: Request, res: Response) => {
		const response = await discussionService.getSingleEntity(
			discussionService.db.queryByIdBuilder(req?.params?.id)
		);
		res.status(response.statusCode).send(response.body);
	});

	router.get('/:id/c', auth, async (req: Request, res: Response) => {
		const response = await commentaryService.getAllDiscussionComentaries(
			req?.params?.id
		);
		res.status(response.statusCode).send(response.body);
	});

	router.put('/:id', auth, async (req: Request, res: Response) => {
		const response = await discussionService.updateEntity(
			req?.params?.id,
			req?.body
		);
		res.status(response.statusCode).send(response.body);
	});

	router.post('/', auth, async (req: Request, res: Response) => {
		const response = await discussionService.newEntity(req?.body);
		res.status(response.statusCode).send(response.body);
	});

	router.delete('/:id', auth, async (req: Request, res: Response) => {
		const response = await discussionService.deleteEntity(req?.params?.id);
		res.status(response.statusCode).send(response.body);
	});

	return router;
};

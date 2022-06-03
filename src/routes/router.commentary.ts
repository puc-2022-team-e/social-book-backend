import express, { Response, Request } from 'express';
import auth from '../middleware/auth';
import { CommentaryServices } from '../services/commentary/commentary.service';
import { DataBaseServices } from '../services/database.services';
const router = express.Router();

export const commentaryRouter = (db: DataBaseServices) => {
	const commentaryService = new CommentaryServices(db);

	router.get('/', auth, async (req: Request, res: Response) => {
		const response = await commentaryService.getEntity();
		res.status(response.statusCode).send(response.body);
	});

	router.get('/:id', auth, async (req: Request, res: Response) => {
		const response = await commentaryService.getSingleEntity(
			commentaryService.db.queryByIdBuilder(req?.params?.id)
		);
		res.status(response.statusCode).send(response.body);
	});

	router.post('/', auth, async (req: Request, res: Response) => {
		const response = await commentaryService.newEntity(req?.body);
		res.status(response.statusCode).send(response.body);
	});

	router.delete('/:id', auth, async (req: Request, res: Response) => {
		const noShortId = true;
		const response = await commentaryService.deleteEntity(req?.params?.id,noShortId);
		res.status(response.statusCode).send(response.body);
	});

	return router;
};

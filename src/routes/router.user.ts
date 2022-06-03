import express, { Response, Request } from 'express';
import auth from '../middleware/auth';
import { DataBaseServices } from '../services/database.services';
import { UserServices } from '../services/users/user.service';
const router = express.Router();

export const userRouter = (db: DataBaseServices) => {
	const userService = new UserServices(db);
	router.post('/', auth, async (req: Request, res: Response) => {
		const response = await userService.newEntity(req?.body);
		res.status(response.statusCode).send(response.body);
	});

	router.get('/', auth, async (req: Request, res: Response) => {
		const response = await userService.getEntity();
		res.status(response.statusCode).send(response.body);
	});

	router.get('/new-user/:email', auth, async (req: Request, res: Response) => {
		const response = await userService.getSingleEntity({
			email: req?.params?.userEmail,
		});
		res.status(response.statusCode).send(response.body);
	});

	router.get('/:id', auth, async (req: Request, res: Response) => {
		const response = await userService.getSingleEntity(
			userService.db.queryByIdBuilder(req?.params?.id)
		);
		res.status(response.statusCode).send(response.body);
	});

	router.put('/:id', auth, async (req: Request, res: Response) => {
		const response = await userService.updateEntity(req?.params?.id, req?.body);
		res.status(response.statusCode).send(response.body);
	});
	return router;
};

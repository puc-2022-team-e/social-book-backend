import { DataBaseServices } from "../services/database.services";
import { OmniSearch } from "../services/omniSearch.services";
import express, { Response, Request } from 'express';
import auth from '../middleware/auth';

const router = express.Router();

export const searchRouter = (db:DataBaseServices)=>{
	const omniSearch = new OmniSearch(db);
	router.get('/', auth, async (req: Request, res: Response) => {
		const response = await omniSearch.search(req.query.q);
		res.status(response.statusCode).send(response.body);
	});

	return router;
}
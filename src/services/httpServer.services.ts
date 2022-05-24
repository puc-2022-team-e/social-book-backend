import { DataBaseServices } from './database.services';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {mainRouter} from '../routes/index';

export class HTTPServer {
	db: DataBaseServices;
	app: express.Application;

	constructor(dbService: DataBaseServices) {
		this.db = dbService;
		this.app = express();
		this.app.enable('trust proxy');
		this.app.use(cors());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());
		this.app.use(cors());
		this.app.use('/api/v1/', mainRouter(this.db));
	}

	listen(port: number) {
		return this.app.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});
	}

	server(){
		return this.app;
	}
}

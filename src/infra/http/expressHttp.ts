import cors from "cors";
import express, { Router } from "express";
import Http from "./http";
import Auth from '../../middleware/auth';

export default class ExpressHttp implements Http {
	app: any;

	constructor () {
    
		this.app = express();    
		this.app.use(express.json());

        //kill container when Ctrl + C 
        process.on('SIGINT', function() {
                process.exit();
        });

        this.app.use(cors());

		
		this.app.all('*',Auth, function (req:any, res:any, next:any) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
			res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, Authorization');
			next();
		});
		
		
		this.app.options('*',Auth, function (req:any, res:any, next:any) {
			res.end();
		});
	}
	
	async route(method: string, url: string, callback: any): Promise<any> {
		this.app[method](url, async function (req: any, res: any) {
			const result = await callback(req.params, req.body);
			res.status(result.httpCode).json(result.data);
		});
	}

    
	async listen(port: number): Promise<void> {
		await this.app.listen(port);
	}
}

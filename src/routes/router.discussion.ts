import express, { Response, Request }  from "express";
import auth from "../middleware/auth";
import { DataBaseServices } from "../services/database.services";
const router = express.Router();

export const discussionRouter = (db:DataBaseServices)=>{
	router.get('/', auth, async (req:Request, res:Response)=>{
		res.status(200).send({
			discussion:true
		})
	});
}
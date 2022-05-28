import Services from "../service.interface";
import { DataBaseServices } from '../database.services';
import DiscussionValidator from "./discussion.validator";
import { ApiResponse } from "../api.response.interface";
import e from "express";

export class DiscussionServices implements Services{
	db:DataBaseServices;
	collection: string;
	discussionValidator:DiscussionValidator;

	constructor(db:DataBaseServices){
		this.db = db;
		this.collection = 'discussions';
		this.discussionValidator = new DiscussionValidator();
	}

	async getDiscussions(discussionId?:string):Promise<ApiResponse>{
		var mongoStatusCode = 200;
		var discussions;
		var query = {}
		try{
			query = this.db.queryBuilder(discussionId);
			console.log(JSON.stringify(query));

			discussions = await this.db.findAny(query, this.collection);
			console.log(JSON.stringify(discussions));
			
			if(discussionId && discussions.length === 0){
				mongoStatusCode = 404;
			}
		}catch(e){
			mongoStatusCode = 500;
		}
		return { statusCode: mongoStatusCode, body:discussions||[] }
	}
}
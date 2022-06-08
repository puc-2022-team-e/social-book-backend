import Services from "../service.interface";
import { DataBaseServices } from '../database.services';
import DiscussionValidator from "./discussion.validator";
import DiscussionInterface from "./discussion.interface";
import { ApiResponse } from "../api.response.interface";

export class DiscussionServices extends Services{
	constructor(db:DataBaseServices){
		super(db);
		this.collection = 'discussions';
		this.validator = new DiscussionValidator();
	}

	castEntity(entity: object):DiscussionInterface {
		return <DiscussionInterface> entity;
	}

	async getAllDiscussionComentaries(discussionId:string):Promise<ApiResponse>{
		var responseBody;
		var commentaryCollection = `commentaries`
		var mongoStatusCode = 200;
		const query = {discussionId:discussionId}
		responseBody = await this.db.findAny(query, commentaryCollection);
		return this.updateResponse(mongoStatusCode,responseBody)
	}
}
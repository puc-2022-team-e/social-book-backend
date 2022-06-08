import { ApiResponse } from '../api.response.interface';
import { DataBaseServices } from '../database.services';
import Services from '../service.interface';
import CommentaryInterface from './commentary.interface';
import CommentaryValidator from './commentary.validator';

export class CommentaryServices extends Services {
	constructor(db: DataBaseServices) {
		super(db);
		this.collection = 'commentaries';
		this.validator = new CommentaryValidator();
	}

	castEntity(entity: object): CommentaryInterface {
		return <CommentaryInterface>entity;
	}

	async getAllDiscussionComentaries(discussionId:string):Promise<ApiResponse>{
		var responseBody;
		var mongoStatusCode = 200;
		const query = {discussionId:discussionId}
		responseBody = await this.db.findAny(query, this.collection);
		return this.updateResponse(mongoStatusCode,responseBody)
	}
}

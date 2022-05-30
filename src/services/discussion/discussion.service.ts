import Services from "../service.interface";
import { DataBaseServices } from '../database.services';
import DiscussionValidator from "./discussion.validator";
import DiscussionInterface from "./discussion.interface";

export class DiscussionServices extends Services{
	constructor(db:DataBaseServices){
		super(db);
		this.collection = 'discussions';
		this.validator = new DiscussionValidator();
	}

	castEntity(entity: object):DiscussionInterface {
		return <DiscussionInterface> entity;
	}
}
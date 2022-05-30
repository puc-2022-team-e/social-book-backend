import Services from '../service.interface';
import { DataBaseServices } from '../database.services';
import UserValidator from './user.validator';
import UserInterface from './user.interface';

export class UserServices extends Services {
	constructor(db: DataBaseServices) {
		super(db);
		this.collection = 'users';
		this.validator = new UserValidator();
	}

	castEntity(entity: object):UserInterface {
		return <UserInterface> entity;
	}
}

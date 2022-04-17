import RepositoryFactory from "../../domain/factory/RepositoryFactory";
import Connection from "../database/Connection";
import UserRepository from "../../domain/repository/UserRepository";
import UserRepositoryDatabase from "../repository/database/UserRepositoryDatabase";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

	constructor (readonly connection: Connection) {
	}

	createUserRepository(): UserRepository {
		return new UserRepositoryDatabase(this.connection);
	}
}
import RepositoryFactory from "../../domain/factory/RepositoryFactory";
import UsersController from "../controller/UsersController";
import Connection from "../database/Connection";
import Http from "./Http";

export default class Router {

	constructor (readonly http: Http, readonly repositoryFactory: RepositoryFactory, readonly connection: Connection) {
	}

	init () {
		this.http.route("get", "/user", async (params: any, body: any) => {
			const userController = new UsersController(this.repositoryFactory);
			const output = await userController.getUser();
			return output;
		});
	}
}

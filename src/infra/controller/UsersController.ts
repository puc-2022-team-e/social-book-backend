import GetUsers from "../../application/usecase/get-user/GetUser";
import GetUserOutput from "../../application/usecase/get-user/GetUserOutput";
import RepositoryFactory from "../../domain/factory/RepositoryFactory";

export default class UsersController {

	constructor (readonly repositoryFactory: RepositoryFactory) {
	}

	async getUser () : Promise<GetUserOutput> {
		const getUser = new GetUsers(this.repositoryFactory);
		const output = await getUser.execute(1);
		return output;
	}
}

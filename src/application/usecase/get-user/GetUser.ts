import RepositoryFactory from "../../../domain/factory/RepositoryFactory";
import UserRepository from "../../../domain/repository/UserRepository";
import GetUserOutput from "./GetUserOutput";


export default class GetUser {
	userRepository: UserRepository;
	
	constructor (readonly repositoryFactory: RepositoryFactory) {
		this.userRepository = repositoryFactory.createUserRepository();
	}

	async execute (id: number): Promise<GetUserOutput> {
		const user = await this.userRepository.getById(id);
		const output = new GetUserOutput(user.name, user.bio);
		return output;
	}
}

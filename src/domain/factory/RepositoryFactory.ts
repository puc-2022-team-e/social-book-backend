
import UserRepository from "../repository/UserRepository";

export default interface RepositoryFactory {
    createUserRepository(): UserRepository;

}
import { Response, Request } from 'express';
import User from '../domain/entities/user';
import UserValidator from '../domain/validators/userValidator';
import UserRepository from '../services/database/repository/userRepository';
import ControllerBase from './ControllerBase';


const ERROR_MSG = 'internal server Error';
const COLLECTION_USERS = 'users';

class UsersController extends ControllerBase {

	private static userRepository = new UserRepository();

	static async getUserByEmail(req: Request, res: Response) {
		const email = req?.params.email;
		console.log(`getting user by email: ${email}`)
		
		const user = new User('__ANYONE__', email, undefined, undefined, undefined,'literato');
		const erros  = UsersController.applyValidationByEntity(UserValidator,user);

		if(Object.keys(erros).length > 0)
		{
			res.status(500).send({
				error: ERROR_MSG,
				message: `Object User inválido: ${JSON.stringify(erros)}`});
			
			return;
		}
		
		try {
			if(await UsersController.isUserRegistered(user.email)){
				res.status(200).send(true);
				return;
			}
			
			res.status(200).send(false);

		} catch (e) {
			console.error(e);
			res.status(500).send(ERROR_MSG);
		
		}
	}

	static async updateUser(req: Request, res: Response) {
		
		const id = req?.params?.id;
		const [user,erros] = UsersController.applyValidationByEntityAndModel(UserValidator,User, <T extends UserModel>(obj: T) => {}, req.body);

		if(Object.keys(erros).length > 0)
		{
			res.status(500).send({
				error: ERROR_MSG,
				message: `Object User inválido: ${JSON.stringify(erros)}`});
			
			return;
		}

		if (id && user) {
			console.log(`Updating users ${id}`);
			try {
				const query = await UsersController.userRepository.queryBuilder(id);

				const newValues = { $set: user };
				const ret = await UsersController.userRepository.updateOne(query, newValues, COLLECTION_USERS);
				if (ret?.modifiedCount && ret?.modifiedCount > 0) {
					res.status(200).send({
						status: 200,
						message: `Document ${id} successfully updated`,
					});
				} else {
					throw new Error(`Error while trying to update user ${id}`);
				}
			} catch (e) {
				console.error(e);
				res.status(500).send({
					status: 500,
					message: ERROR_MSG,
					error: e,
				});
			}
		} else {
			res.status(500).send({
				status: 500,
				message: ERROR_MSG + ` Missing Body or ID`,
			});
		}
	}

	static async postUser(req: Request, res: Response) {
		
		const [user,erros] = UsersController.applyValidationByEntityAndModel(UserValidator,User, <T extends UserModel>(obj: T) => {}, req.body);

		if(Object.keys(erros).length > 0)
		{
			res.status(500).send({
				error: ERROR_MSG,
				message: `Object User inválido: ${JSON.stringify(erros)}`});
			
			return;
		}
						
		if (user) {
			try {

				if(await UsersController.isUserRegistered(user.email))
				{
					res.status(200).send({
						message: `O usuário cujo email é ${user.email} já está registrado na base de dados.`});
						return;
				}

				const ret = await UsersController.userRepository.insertOne(user, COLLECTION_USERS);

				res.status(201).send({
					status: 'success',
					id: ret?.insertedId,
				});
			} catch (e) {
				console.error(e);
				res.status(500).send(ERROR_MSG);
			}
		} else {
			res.status(500).send({
				error: ERROR_MSG,
				message: 'invalid request body; Body must be an User object like {"userName":"User Test","email":"teste@teste.com"}',
			});
		}
	}

	private static async isUserRegistered(userEmail:string | undefined){

		var query = {email: userEmail};
		const hasUser = await UsersController.userRepository.findAny(query, COLLECTION_USERS);
		if(hasUser.length > 0)
			return true;		
		return false;
	}
}
export default UsersController;

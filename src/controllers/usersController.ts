import { Response, Request } from 'express';
import User from '../domain/entities/user';
import UserValidator from '../domain/validators/userValidator';
import UserRepository from '../services/database/repository/userRepository';


const mapper = require('automapper-js');
const ERROR_MSG = 'internal server Error';
const COLLECTION_USERS = 'users';

class UsersController {

	private static userRepository = new UserRepository();
	private static validator = new UserValidator();
	

	static async getUserByEmail(req: Request, res: Response) {
		const email = req?.params.email;
		console.log(`getting user by email: ${email}`)
		
		const user = new User('__ANYONE__', email, undefined, undefined, undefined);
		
		const erros = UsersController.validator.validate(user);

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

	static async postUser(req: Request, res: Response) {
		
		const user = mapper(User, req.body);
		const erros = UsersController.validator.validate(user as UserModel)

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

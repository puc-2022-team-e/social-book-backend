import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import Discussion from '../domain/entity/discussion';
import { HttpResponse } from '../domain/entity/httpResponse';
import IValidator from '../domain/interfaces/IValidator';
import { collections, connectToDatabase } from '../services/database.services';


class DiscussionsController {

	private httpCode: number;
	private message:  string | undefined;
	private data:     any | undefined;
	

	constructor (readonly validator: IValidator<Discussion>) {
		this.httpCode = 200;
	}

	static async getDiscussionById(req: Request, res: Response) {
		const id = req?.params?.id;
		await connectToDatabase();

		try {
			const query = { _id: new ObjectId(id) };
			const discussion = await collections.discussons?.findOne(query);
			if (discussion) {
				res.status(200).send(discussion);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to find any document`
				);
		}
	}

	async getAllDiscussions()  {

		// TODO:
		// A ideia da validação
		// 1 - Mapper o Json que está vindo da Requisição para o Objeto Discussion, no momento de validar, acho que tipar é importante até para manter consistencia, 
		// 2 - Passar o objeto para o validator genérico -> this.validator.validate(objetoaqui)
		// 3 - Esse objecto HttpResponse ficou, estranho, mas depois a gente escreve um buildr para ele, aí como diz o José, vai brilhar.   
		// Com o builder a construção irá ficar igual está abaixo :
		// HttpResponseBuilder().WithHttpCode(200).WithMessage("Request realized with successfull!"").WithData(object que será enviado no response da solicitação)

		// Da forma que estava, não iriamos conseguir usar inversão de dependência, pois os método estavam estáticos, mesma deixando eles não estáticos não dava para passar
		// um injeção de dependência, desse modo, não iríamos conseguir criar os testes depois, um teste de unidade me refiro. 

		// Veja se vale a pena, se você quiser pode melhorar essa versão que eu implementei. 
		// Se a gente deixar daquele desse jeito que está, da para trabalhar também, mas eu não vou ficar muito bitolado em reuso e OO não, vou enfiar os ifs para dentro e
		// entregar o projeto para a gente 'passar de ano' rs 
		
		await connectToDatabase();
		try {				

			this.data = await collections.discussons?.find().toArray();
			if (this.data) 
				this.message = "Request realized with successfull!"
			
		} catch (error) {
				this.httpCode = 404;
				this.message = "unable to find match matching document!"
			}

			return new HttpResponse(this.httpCode, this.message, this.data);
	 };

	static async deleteDiscussionById(req: Request, res: Response) {
		const id = req?.params?.id;
		await connectToDatabase();

		try {
			const query = { _id: new ObjectId(id) };
			const discussion = await collections.discussons?.deleteOne(query);
			if (discussion) {
				res.status(200).send(discussion);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to delete discussion`
				);
		}
	}

	static async insertDiscussion(req: Request, res: Response) {
		await connectToDatabase();
		try {
			const discussion = await collections.discussons?.insertOne(req.body);
			if (discussion) {
				res.status(200).send(discussion);
			} else {
				res
					.status(500)
					.send(
						`unable to add discussion document: ${req.body} `
					);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to add discussion document: ${req.body} `
				);
		}
	}
}
export default DiscussionsController;

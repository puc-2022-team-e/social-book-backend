import { Response, Request } from 'express';
import Discussion from '../domain/entities/discussion';
import DiscussionValidator from '../domain/validators/discussionValidator';
import BookRepository from '../services/database/repository/bookRepository';
import DiscussionRepository from '../services/database/repository/discussionRepository';
import ControllerBase from './ControllerBase';

const ERROR_MSG = 'internal server Error';
const COLLECTION_DISCUSSIONS = 'discussions';
const COLLECTION_BOOKS = 'books';
class DiscussionsController extends ControllerBase {

	private static discussionRepository = new DiscussionRepository();
	private static bookRepository = new BookRepository();

	static async getDiscussions(req: Request, res: Response) {
		const id = req?.params.id;
		console.log(`getting discussions id: ${id}`)
		try {
			var query = {};
			var discussions;
			
			if (id) {
				const mongoId = await DiscussionsController.bookRepository.queryBuilder(id);
				if (!mongoId) {
					throw new Error(`invalid id`);
				}
				query = { _id: mongoId };
			}
			console.log(`query: ${JSON.stringify(query)}`);
			discussions = await DiscussionsController.discussionRepository.findAny(query, COLLECTION_DISCUSSIONS);
			console.log(`Discussions: ${JSON.stringify(discussions)}`)

			if (!discussions) {
				res.status(404).send(`not found`);
			} else {
				res.status(200).send(discussions);
			}
		} catch (e) {
			console.error(e);
			res.status(500).send(ERROR_MSG);
		}
	}

	static async postDiscussions(req: Request, res: Response) {
		
		const [discussion,erros] = DiscussionsController.applyValidationByEntityAndModel(DiscussionValidator,Discussion, <T extends DiscussionModel>(obj: T) => {}, req.body);

		if(Object.keys(erros).length > 0)
		{
			res.status(500).send({
				error: ERROR_MSG,
				message: `Object Discussion inválido: ${JSON.stringify(erros)}`});
			
			return;
		}
						
		if (discussion) {
			try {
				const books = await DiscussionsController.bookRepository.findAny(await DiscussionsController.bookRepository.queryBuilder(discussion.bookId), COLLECTION_BOOKS);
				if(books.length == 0)
				{
					res.status(500).send({
						error: ERROR_MSG,
						message: `O identificador do livro ${discussion.bookId} não está registrado na base de dados.`});
					
						return;
				}

				const ret = await DiscussionsController.discussionRepository.insertOne(discussion, COLLECTION_DISCUSSIONS);

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
				message: 'invalid request body; Body must be a discussion object',
			});
		}
	}

	static async updateDiscussion(req: Request, res: Response) {
		const values = req?.body;
		const id = req?.params?.id;

		if (id && values) {
			try {
				const mongoId = await DiscussionsController.discussionRepository.queryBuilder(id);
				if (!mongoId) {
					throw new Error(`invalid ID`);
				}
				const query = { _id: mongoId };
				const newValues = { $set: values };
				
				const ret = await DiscussionsController.discussionRepository.updateOne(query, newValues, COLLECTION_DISCUSSIONS);

				if (ret?.modifiedCount && ret?.modifiedCount > 0) {
					res.status(200).send({
						status: 200,
						message: `Discussion ${id} successfully updated`,
					});
				} else {
					throw new Error(`Error while trying to update discussion id: ${id}`);
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

	static async deleteDiscussion(req: Request, res: Response) {
		const id = req?.params?.id;
		if (id) {
			try{
				const mongoId = await DiscussionsController.discussionRepository.queryBuilder(id);
				const query = { _id: mongoId };
				const ret = await DiscussionsController.discussionRepository.deleteOne(query,COLLECTION_DISCUSSIONS);
				if (ret?.deletedCount === 1) {
					res.status(200).send({
						status: 200,
						message: `deleted: ${ret?.deletedCount}`,
					});
				} else {
					throw new Error(`Cant delete discussion id ${id}`);
				}
			}catch(e){
				res.status(500).send({
					status: 500,
					message: e,
				});
			}
		} else {
			res.status(500).send({
				status: 500,
				message: ERROR_MSG + ` Missing ID`,
			});
		}
	}
	
}
export default DiscussionsController;

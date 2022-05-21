import { Response, Request } from 'express';
import Commentary from '../domain/entities/commentary';
import CommentaryValidator from '../domain/validators/commentaryValidator';
import CommentaryRepository from '../services/database/repository/commentaryRepository';
import DiscussionRepository from '../services/database/repository/discussionRepository';

const mapper = require('automapper-js');
const ERROR_MSG = 'internal server Error';
const COLLECTION = 'commentaries';
const COLLECTION_DISCUSSIONS = 'discussions';
class CommentariesController {

	private static commentaryRepository = new CommentaryRepository();
	private static discussionRepository = new DiscussionRepository();

	static async getAllCommentariesByIdDiscussion(req: Request, res: Response) {
		const discussionID = req?.params?.discussionid;

		if (discussionID) {
			const query = { discutionId: discussionID };
			const allDiscussions = await CommentariesController.commentaryRepository.findAny(query, COLLECTION);
			res.status(200).send(allDiscussions);
		} else {
			res.status(404).send({
				status: 404,
				message: `discussionID ${discussionID} not found`,
			});
		}
	}

	static async getSingleCommentary(req: Request, res: Response) {
		const commentaryID = req?.params?.commentaryid;

		if (commentaryID) {
			const mongoId = await CommentariesController.commentaryRepository.queryBuilder(commentaryID);
			if (mongoId) {
				const query = { _id: mongoId };
				const commentary = await CommentariesController.commentaryRepository.findOne(query, COLLECTION);
				res.status(200).send(commentary);
			} else {
				res.status(500).send({
					status: 500,
					message: `${ERROR_MSG}: Invalid commentary ID: ${commentaryID}`,
				});
			}
		} else {
			res.status(404).send({
				status: 404,
				message: `Commentary ${commentaryID} not found`,
			});
		}
	}

	static async insertCommentary(req: Request, res: Response) {

		const validator = new CommentaryValidator();
		const commentary = mapper(Commentary, req.body);
		const erros = validator.validate(commentary as CommentaryModel)

		if(Object.keys(erros).length > 0)
		{
			res.status(500).send({
				error: ERROR_MSG,
				message: `Object Commentary inválido: ${JSON.stringify(erros)}`});
			
			return;
		}

		if (commentary) {
			try {	
				const discussions = await CommentariesController.discussionRepository.findAny(await CommentariesController.discussionRepository.queryBuilder(commentary.discussionId), COLLECTION_DISCUSSIONS);
				if((await discussions).length == 0)
				{
					res.status(500).send({
						error: ERROR_MSG,
						message: `O identificador da discussão ${commentary.discussionId} não está registrado na base de dados.`});
					
						return;
				}
				
				const ret = await CommentariesController.commentaryRepository.insertOne(commentary, COLLECTION);
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
				message: 'invalid request; Body must be a commentary object',
			});
		}
	}

	static async deleteCommentaryById(req: Request, res: Response) {
		const commentaryID = req?.params?.commentaryid;

		if (commentaryID) {
			try {
				const mongoId = await CommentariesController.commentaryRepository.queryBuilder(commentaryID);
				if (mongoId) {
					const query = { _id: mongoId };
					const ret = await CommentariesController.commentaryRepository.deleteOne(query, COLLECTION);
					if (ret?.deletedCount === 1) {
						res.status(200).send({
							status: 200,
							message: `deleted: ${ret?.deletedCount}`,
						});
					} else {
						throw new Error(`Cant delete discussion ${commentaryID}`);
					}
				} else {
					res.status(500).send({
						status: 500,
						message: `${ERROR_MSG}: Invalid commentary ID: ${commentaryID}`,
					});
				}
			} catch (e) {}
		} else {
			res.status(500).send({
				status: 500,
				message: ERROR_MSG + ` Missing ID`,
			});
		}
	}
}
export default CommentariesController;

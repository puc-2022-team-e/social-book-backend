import { Response, Request } from 'express';
import { DataBaseServices } from '../services/database.services';

const ERROR_MSG = 'internal server Error';
const dataBase = new DataBaseServices();
const COLLECTION = 'commentaries';
class CommentariesController {
	static async getAllCommentariesByIdDiscussion(req: Request, res: Response) {
		const discussionID = req?.params?.discussionid;

		if (discussionID) {
			const query = { discutionId: discussionID };
			await dataBase.connect();
			const allDiscussions = dataBase.findAny(query, COLLECTION);
			await dataBase.disconnect();
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
			const mongoId = dataBase.mongoIDHandler(commentaryID);
			if (mongoId) {
				const query = { _id: mongoId };
				await dataBase.connect();
				const commentary = await dataBase.findOne(query, COLLECTION);
				await dataBase.disconnect();
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
		const commentary = req.body;
		if (commentary) {
			try {
				await dataBase.connect();
				const ret = await dataBase.insertOne(commentary, COLLECTION);
				await dataBase.disconnect();
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
				const mongoId = dataBase.mongoIDHandler(commentaryID);
				if (mongoId) {
					const query = { _id: mongoId };
					await dataBase.connect();
					const ret = await dataBase.deleteOne(query, COLLECTION);
					await dataBase.disconnect();
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

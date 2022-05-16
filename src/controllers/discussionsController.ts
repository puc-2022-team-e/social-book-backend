import { Response, Request } from 'express';
import { DataBaseServices } from '../services/database.services';

const ERROR_MSG = 'internal server Error';
const dataBase = new DataBaseServices();
class DiscussionsController {
	static collection = 'discussions';

	static async getDiscussions(req: Request, res: Response) {
		const id = req?.params.id;

		try {
			var query = {};
			var discussions;
			await dataBase.connect();
			if (id) {
				const mongoId = dataBase.mongoIDHandler(id);
				if (!mongoId) {
					throw new Error(`invalid id`);
				}
				query = { _id: mongoId };

				discussions = dataBase.findOne(query, this.collection);
			} else {
				discussions = await dataBase.findAny(query, this.collection);
			}
			await dataBase.disconnect();

			if (!discussions) {
				res.status(404).send(`not found`);
			} else {
				res.send(200).send(discussions);
			}
		} catch (e) {
			console.error(e);
			await dataBase.disconnect();
			res.status(500).send(ERROR_MSG);
		}
	}

	static async postDiscussions(req: Request, res: Response) {
		const discussion = req.body;

		if (discussion) {
			try {
				await dataBase.connect();
				const ret = await dataBase.insertOne(discussion, this.collection);
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
				message: 'invalid request body; Body must be a discussion object',
			});
		}
	}

	static async updateDiscussion(req: Request, res: Response) {
		const values = req?.body;
		const id = req?.params?.id;

		if (id && values) {
			try {
				const mongoId = dataBase.mongoIDHandler(id);
				if (!mongoId) {
					throw new Error(`invalid ID`);
				}
				const query = { _id: mongoId };
				const newValues = { $set: values };
				await dataBase.connect();
				const ret = await dataBase.updateOne(query, newValues, this.collection);
				await dataBase.disconnect();

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
				const mongoId = dataBase.mongoIDHandler(id);
				const query = { _id: mongoId };
				const ret = await dataBase.deleteOne(query,this.collection);
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

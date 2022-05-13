import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import { collections, connectToDatabase } from '../services/database.services';


class DiscussionsController {

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

    static async getAllDiscussions(req: Request, res: Response) {
		await connectToDatabase();
		try {
			const book = await collections.discussons?.find().toArray();
			if (book) {
				res.status(200).send(book);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to find match matching document with id: ${req.params.id} `
				);
		}
	}

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

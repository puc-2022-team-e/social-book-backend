import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import { collections, connectToDatabase } from '../services/database.services';

class CommentariesController {

    static async getAllCommentariesByIdDiscussion(req: Request, res: Response) {
		await connectToDatabase();
		try {
			const commentaries = await collections.commentaries?.find().toArray();
			if (commentaries) {
				res.status(200).send(commentaries);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to find match matching document with id: ${req.params.id} `
				);
		}
	}

	static async deleteComentaryById(req: Request, res: Response) {
		const id = req?.params?.id;
		await connectToDatabase();

		try {
			const query = { _id: new ObjectId(id) };
			const discussion = await collections.commentaries?.deleteOne(query);
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

	static async insertComentary(req: Request, res: Response) {
		await connectToDatabase();
		try {
			const discussion = await collections.commentaries?.insertOne(req.body);
			if (discussion) {
				res.status(200).send(discussion);
			}
		} catch (error) {
			res
				.status(404)
				.send(
					`unable to add commentary document: ${req.body} `
				);
		}
	}
}
export default CommentariesController;

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID =
	'963927842810-or0j5j8kmvf4c01hd15bbompaqut7qpu.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
import { Response, Request } from 'express';

const auth = async (req: Request, res: Response, next: any) => {
	if (req.headers.authorization) {
		const ticket = await client.verifyIdToken({
			idToken: req.headers.authorization,
			audience: CLIENT_ID,
		});
		const payload = ticket.getPayload();
		const userid = payload['sub'];
		if (!userid) {
			next(
				res.json(403).json({
					error: `forbidden`,
				})
			);
		}
	} else {
		next(
			res.status(500).json({
				error: 'Invalid Auth',
			})
		);
	}
	next();
};

export default auth;

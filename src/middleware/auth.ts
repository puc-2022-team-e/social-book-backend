const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID =
	'963927842810-or0j5j8kmvf4c01hd15bbompaqut7qpu.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
import { Response, Request } from 'express';

const auth = async (req: Request, res: Response, next: any) => {
	var STATUS_CODE = 403;
	var message = 'forbidden';

	//if running localhost or while testing, dont ask for gmail token;
	if (process.env.NODE_ENV === "development") {
		next();
	}

	if (req.headers.authorization) {
		try {
			const ticket = await client.verifyIdToken({
				idToken: req.headers.authorization,
				audience: CLIENT_ID,
			});

			const payload = ticket.getPayload();
			const userId = payload['sub'];

			if (userId) {
				STATUS_CODE = 200;
			}
		} catch (e: any) {
			console.error(e);
			if (e && typeof e === 'object' && e.hasOwnProperty('message')) {
				message = e.message;
			}
		}
	} else {
		STATUS_CODE = 500;
		message = 'Missing Authorization header';
	}

	if (STATUS_CODE === 200) {
		next();
	} else {
		const responseBody = {
			error: message,
		};

		next(res.status(STATUS_CODE).json(responseBody));
	}
};

export default auth;

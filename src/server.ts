// import express from 'express';
// import bodyParser from 'body-parser';
// import routes from './routes/index';
// import cors from 'cors';

// const version = require('../package').version
// const app = express();

// const port = process.env.PORT || 8077;
// const printServerMode = process.env.NODE_ENV || `development`
// //kill container when Ctrl + C
// process.on('SIGINT', function() {
//     process.exit();
// });

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.json());
// app.use(cors());

// app.use('/api/v1/', routes);

// app.listen(port, () => {
// 	console.log(`Starting social books server
// 	version: ${version}
// 	in mode ${printServerMode}`)
//     console.log(`Server started on port ${port}`);
// });

// //export for test
// export default app;

import config  from './config';
import { DataBaseServices } from './services/database.services';
import { HTTPServer } from './services/httpServer.services';

process.on('SIGINT', function () {
	process.exit();
});

process.on('uncaughtException', (e) => {
	console.error(e);
	throw new Error('deu ruim uncaughtException');
});

process.on('unhandledRejection', (e) => {
	console.error(e);
	throw new Error('Deu ruin: unhandledRejection');
});

(async () => {
	console.log("[socialBooks-server][starting]")
	try {
		console.info(`Starting Server mode ${config.serverMod}`);
		const dbServer = new DataBaseServices(config.mongoURI);
		await dbServer.connect();

		const server = new HTTPServer(dbServer);
		server.listen(Number(config.port));
	} catch (e: any) {
		console.error(e);
		if (e.toPrint) throw new Error(e.toPrint());
		process.exit(1);
	}
})();
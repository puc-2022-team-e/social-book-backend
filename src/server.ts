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

export async function server(mongoUri:string) {
	console.log("[socialBooks-server][starting]")
	try {
		console.info(`Starting Server mode ${config.serverMod}`);
		console.info(`MongoURI: ${mongoUri}`);
		const dbServer = new DataBaseServices(mongoUri);
		await dbServer.connect();

		const server = new HTTPServer(dbServer);
		server.listen(Number(config.port));
	} catch (e: any) {
		console.error(e);
		if (e.toPrint) throw new Error(e.toPrint());
		process.exit(1);
	}
};

//global.mongURI used for test
server(global.mongoURI||config.mongoURI);
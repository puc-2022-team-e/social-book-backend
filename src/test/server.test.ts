import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { HTTPServer } from '../services/httpServer.services';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataBaseServices } from '../services/database.services';

declare global {
	var server: Express.Application;
	var mongoURI:string
	var mongoMock:MongoMemoryServer;
	var dbServices:DataBaseServices
}

const apiPath = '/api/v1/';

chai.use(chaiHttp);
chai.should();

describe(`server`, () => {


	describe('testing dataBaseServices', ()=>{
		it('mongo service should start', async ()=>{
			global.mongoMock= await MongoMemoryServer.create();
			global.mongoURI = global.mongoMock.getUri();
			global.dbServices = new DataBaseServices(global.mongoURI);
			global.dbServices.connect();
			chai.expect(global.dbServices).not.to.be.undefined;
			chai.expect(global.dbServices.db.databaseName).to.be.equal('socialbooks');
			global.dbServices.disconnect();
		});
	});

	describe(`api ping`, () => {
		it('should be status 200', async () => {
			await global.dbServices.connect();
			const app = new HTTPServer(global.dbServices);
			global.server = app.server;
			chai
				.request(global.server)
				.get(`${apiPath}/ping`)
				.then((res) => {
					expect(res).to.have.status(200);
				})
				.catch((e) => {
					throw e;
				});
		});
	});

	describe(`api ping 2`, () => {
		it('should not be status 500', async () => {
			chai
				.request(global.server)
				.get(`${apiPath}/ping`)
				.then((res) => {
					expect(res).to.not.have.status(500);
				})
				.catch((e) => {
					throw e;
				});
		});
	});

	describe(`api get books`, () => {
		it('should be status 200', async () => {
			chai
				.request(global.server)
				.get(`${apiPath}/b`)
				.then((res) => {
					expect(res).to.have.status(200);
				})
				.catch((e) => {
					throw e;
				});
		});
	});

	//628451ecd16f1c360fc4954b
	describe(`api get book by ID`, () => {
		it('should be status 200', async () => {
			chai
				.request(global.server)
				.get(`${apiPath}/b/628451ecd16f1c360fc4954b`)
				.then((res) => {
					expect(res).to.have.status(200);
				})
				.catch((e) => {
					throw e;
				});
		});
	});


	describe(`api put books`, () => {
		it('should be status 200', async () => {
			chai
				.request(global.server)
				.put(`${apiPath}/b`)
				.then((res) => {
					expect(res).to.have.status(200);
				})
				.catch((e) => {
					throw e;
				});
		});
	});

	describe(`api post books`, () => {
		it('should be status 201', async () => {
			chai
				.request(global.server)
				.post(`${apiPath}/b`)
				.then((res) => {
					expect(res).to.have.status(201);
				})
				.catch((e) => {
					throw e;
				});
		});
	});

	describe(`api delete books`, () => {
		it('should be status 200', async () => {
			chai
				.request(global.server)
				.delete(`${apiPath}/b`)
				.then((res) => {
					expect(res).to.have.status(200);
				})
				.catch((e) => {
					throw e;
				});
		});
	});
});

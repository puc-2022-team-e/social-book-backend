import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import { HTTPServer } from '../services/httpServer.services';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataBaseServices } from '../services/database.services';
import { bookMock } from './test.data/book.mock';
import config from '../config';
import auth from '../middleware/auth';
import { discussionMock } from './test.data/discussion.mock';

declare global {
	var server: HTTPServer;
	var mongoURI: string;
	var mongoMock: MongoMemoryServer;
	var dbServices: DataBaseServices;
}

const apiPath = '/api/v1';

chai.use(chaiHttp);
chai.should();
describe(`instancing server`, () => {
	describe('Setting Up Server', () => {
		console.log('setup');
		it('mongo service should start', async () => {
			global.mongoMock = await MongoMemoryServer.create();
			global.mongoURI = global.mongoMock.getUri();
			global.dbServices = new DataBaseServices(global.mongoURI);
			global.server = new HTTPServer(global.dbServices);
			await global.dbServices.connect();
			global.server.listen(Number(config.port));
			expect(global.dbServices).not.to.be.undefined;
			expect(global.dbServices.db.databaseName).to.be.equal('socialbooks');
		});
		console.log('setup successfully');
	});
	/*
	 * api/v1/ping
	 */
	describe('/GET ping', () => {
		it('it should return 200 with body property pong equal true', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/ping`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('pong');
					res.body.should.have.property('pong').eql(true);
					done();
				});
		});
	});

	/*
	 * api/v1/b success
	 */
	describe(`/POST ${apiPath}/b`, () => {
		it('it should post new book and return status code 201', (done) => {
			chai
				.request(global.server.server())
				.post(`${apiPath}/b`)
				.send(bookMock)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql('success');
					done();
				});
		});
	});

	describe(`/GET ${apiPath}/b/bookMock`, () => {
		it('it should return status code 200 and object mockBook', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/b/bookMock`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});

	describe(`/GET ${apiPath}/b/notFound`, () => {
		it('it should return status code 404 and empty object', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/b/noFound`)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	describe(`/GET ${apiPath}/b/`, () => {
		it('it should return status code 200 and all books', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/b/`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});

	describe(`/PUT ${apiPath}/b/bookMock`, () => {
		it('it should return status code 200 and object with success message', (done) => {
			chai
				.request(global.server.server())
				.put(`${apiPath}/b/bookMock`)
				.send({
					averageRating: 3,
					ratingCount: 1,
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql(200);
					done();
				});
		});
	});

	describe(`/DELETE ${apiPath}/b/bookMock`, () => {
		it('it should return status code 200 and object', (done) => {
			chai
				.request(global.server.server())
				.delete(`${apiPath}/b/bookMock`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql(200);
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('deleted: 1');
					done();
				});
		});
	});

	/*
	 * api/v1/d Discussions
	 */

	describe(`/POST ${apiPath}/d/`, () => {
		it('it should return status code 200', (done) => {
			chai
				.request(global.server.server())
				.post(`${apiPath}/d/`)
				.send(discussionMock)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	describe(`/GET ${apiPath}/d/`, () => {
		it('it should return status code 200', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/d/`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});



	/*
	 * api/v1/b server error
	 */
	describe(`/POST ${apiPath}/b/`, () => {
		it('it should fail to insert new book and should return status code 500', (done) => {
			global.server.db.disconnect().then(() => {
				chai
					.request(global.server.server())
					.post(`${apiPath}/b/`)
					.send(bookMock)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});
	});

	describe(`/GET ${apiPath}/b/`, () => {
		it('it should fail to get all books return status code 500', (done) => {
			global.server.db.disconnect().then(() => {
				chai
					.request(global.server.server())
					.get(`${apiPath}/b/`)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});
	});

	describe(`/GET ${apiPath}/b/bookMock`, () => {
		it('it should fail to get bookMock and return status code 500', (done) => {
			global.server.db.disconnect().then(() => {
				chai
					.request(global.server.server())
					.get(`${apiPath}/b/bookMock`)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});
	});

	describe(`/PUT ${apiPath}/b/bookMock`, () => {
		it('it should fail to update and return status code 500', (done) => {
			global.server.db.disconnect().then(() => {
				chai
					.request(global.server.server())
					.put(`${apiPath}/b/bookMock`)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});
	});

	describe(`/DELETE ${apiPath}/b/bookMock`, () => {
		it('it should fail to delete bookMock and return status code 500', (done) => {
			global.server.db.disconnect().then(() => {
				chai
					.request(global.server.server())
					.delete(`${apiPath}/b/bookMock`)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});
	});

	/*
	 * dataBase Service error
	 */
	// describe('Try do active mongoDB with wrong URI should fail', () => {
	// 	it('bad uri', async() => {
	// 		chai
	// 			.expect(new DataBaseServices('local-host'))
	// 			.to.throw(new Error(`deu ruim DataBaseServices`));
	// 	});
	// });

	/*
	 * auth stub
	 */

	// describe(`auth Stub`, () => {
	// 	it('it should valid Auth', async () => {
	// 		global.isTesting = true;
	// 		const next = (res:Response)=>{
	// 			return res;
	// 		}
	// 		const authorized = await auth({headers:{authorization:"eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxYTgyNTllYjA3NjYwZWYyMzc4MWM4NWI3ODQ5YmZhMGExYzgwNmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTYzOTI3ODQyODEwLW9yMGo1ajhrbXZmNGMwMWhkMTViYm9tcGFxdXQ3cXB1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTYzOTI3ODQyODEwLW9yMGo1ajhrbXZmNGMwMWhkMTViYm9tcGFxdXQ3cXB1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE1ODI0MjUyODM1MzAxNDYyNTMxIiwiaGQiOiJ0b3R2cy5jb20uYnIiLCJlbWFpbCI6InJlbmF0by5jdW5oYUB0b3R2cy5jb20uYnIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlI4aDVSWmFTeVJaX203UkNiZmxmTGciLCJuYW1lIjoiUmVuYXRvIGRhIEN1bmhhIFNpbHZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnRkFkd0ozUXdwLVlLMjJMd0NtWGZ1UjlZajBXX25rMkVFUUlxZzJnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlJlbmF0byIsImZhbWlseV9uYW1lIjoiZGEgQ3VuaGEgU2lsdmEiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY1Mjk5OTQyMywiZXhwIjoxNjUzMDAzMDIzLCJqdGkiOiI0YjRkYTM1MWQxNjIzZTQ2ODI4ZjI0N2RjYTE5NTEwMzEwOTgyNTU0In0.PH1g-a-lZva1XVxMXIfEAvG9-kJ-_cRs4gWjrLLCUqVQIGM0gYW9Ypu3r859QgCb5N1cv7DETHAcLN14DTL9s894mg0RolxYL7BwQzqffhRlIydg618mIj-EcNsm9RLHpN4cC_AoESVS8nassNHv6hNlpFGkRMY1dodyrPZOzhvSdmVKiWvLrcA6wPzG3rExPaMa_rcyLFZCBUtHIIyklpU585hTBsZoRmM6eCS2AVG3A3dWNbJggsPg79094c2Xpbum8bXMhgqmSIRdN-OtFWFoUJMvnuXRUq4uYPJxtL0EnMwltLihWK6HgUal-zxC7VS7N93aLQQ5oChU3TfxwQ"}} as Request, {} as Response, next);
	// 		console.log(JSON.stringify(authorized))
	// 		chai
	// 			.expect(1).to.be.eql(1);
	// 	});
	// });
});

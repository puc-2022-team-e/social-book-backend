import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import { HTTPServer } from '../services/httpServer.services';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataBaseServices } from '../services/database.services';
import { bookMock } from './test.data/book.mock';
import config from '../config';
import auth from '../middleware/auth';
import { discussionMock } from './test.data/discussion.mock';
import * as mongoDB from 'mongodb';
declare global {
	var server: HTTPServer;
	var mongoURI: string;
	var mongoMock: MongoMemoryServer;
	var dbServices: DataBaseServices;
	var obj:any;
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
		it('it should create new discussion and return status code 201', (done) => {
			chai
				.request(global.server.server())
				.post(`${apiPath}/d/`)
				.send(discussionMock)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql('success');
					res.body.should.have.property('id');
					done();
				});
		});
	});

	describe(`/POST ${apiPath}/d/`, () => {
		it('it should create new discussion and return status code 201', (done) => {
			chai
				.request(global.server.server())
				.post(`${apiPath}/d/`)
				.send({
					_id: new mongoDB.ObjectId('627e7db72547665b997e118e'),
					short:"6387y2f",
					title:"test-discussion",
					bookId:"d867989b-86d3-4e95-84ef-57b1d08d4b31",
					userId:"test.mock",
					created:"2022-05-28T21:40:30.000Z"
				})
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql('success');
					res.body.should.have.property('id');
					res.body.should.have.property('id').eql('627e7db72547665b997e118e')
					done();
				});
		});
	});

	describe(`/GET ${apiPath}/d/`, () => {
		console.log(global.obj)
		it('it should get all discussions and return status code 200', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/d/`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(2);
					
					done();
				});
		});
	});

	describe(`/GET ${apiPath}/d/`, () => {
		console.log(global.obj)
		it('it should get one discussion by id 627e7db72547665b997e118e return status code 200', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/d/627e7db72547665b997e118e`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					done();
				});
		});
	});

	describe(`/PUT ${apiPath}/d/5287a2e`, () => {
		it('it should update discussion and return status code 200 and object with success message', (done) => {
			chai
				.request(global.server.server())
				.put(`${apiPath}/d/5287a2e`)
				.send({
					updated: "2022-05-30T02:15:30.000Z",
					comments: [
						{
							id:"126iH51fxRfdcaf994f3eax",
							order:1,
							userId:"",
							created:"2022-05-30T02:16:23.000Z",
							text:"This is a drill",
						}
					],
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

	describe(`/DELETE ${apiPath}/d/5287a2e`, () => {
		it('it should return status code 200 and object', (done) => {
			chai
				.request(global.server.server())
				.delete(`${apiPath}/d/5287a2e`)
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
	 * api/v1/c Commentaries
	 */
	describe(`/POST ${apiPath}/c/`, () => {
		it('it should create new discussion and return status code 201', (done) => {
			chai
				.request(global.server.server())
				.post(`${apiPath}/c/`)
				.send({
					_id:  new mongoDB.ObjectId("62fdbf5c0ef8a50b4cdd9a8b"),
					discussionId: "627e7db72547665b997e118e",
					commentary: "This is a nice test",
					registerDate: "2022-05-29T20:17:11.728+00:00",
				})
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql('success');
					res.body.should.have.property('id');
					res.body.should.have.property('id').eql('62fdbf5c0ef8a50b4cdd9a8b')
					done();
				});
		});
	});

	describe(`/POST ${apiPath}/c/`, () => {
		it('it should create other new discussion and return status code 201', (done) => {
			chai
				.request(global.server.server())
				.post(`${apiPath}/c/`)
				.send({
					_id:  new mongoDB.ObjectId("63fdbf5c0ef9a50b4cdd1a2c"),
					discussionId: "627e7db72547665b997e118e",
					commentary: "I would say this is a nice test",
					registerDate: "2022-05-29T20:30:11.728+00:00",
				})
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql('success');
					res.body.should.have.property('id');
					res.body.should.have.property('id').eql('63fdbf5c0ef9a50b4cdd1a2c')
					done();
				});
		});
	});

	describe(`/GET ${apiPath}/c/63fdbf5c0ef9a50b4cdd1a2c`, () => {
		it('it should get commentary by ID and return status code 200', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/c/63fdbf5c0ef9a50b4cdd1a2c`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				});
		});
	});

	describe(`/get ${apiPath}/c/`, () => {
		it('it should get discussion and return status code 200', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/c/`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	describe(`/get ${apiPath}/c/d/discussionID`, () => {
		it('it should get all commentaries and return status code 200', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/c/d/627e7db72547665b997e118e`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	// describe(`/delete ${apiPath}/c/63fdbf5c0ef9a50b4cdd1a2c`, () => {
	// 	it('it should delete commentary by ID and return status code 200', (done) => {
	// 		chai
	// 			.request(global.server.server())
	// 			.delete(`${apiPath}/c/63fdbf5c0ef9a50b4cdd1a2c`)
	// 			.end((err, res) => {
	// 				res.should.have.status(200);
	// 				res.body.should.be.a('object');
	// 				done();
	// 			});
	// 	});
	// });

	describe(`/GET ${apiPath}/u/`, () => {
		it('it should get all users and return status code 200', (done) => {
			chai
				.request(global.server.server())
				.get(`${apiPath}/u`)
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

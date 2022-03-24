import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server'; 

chai.use(chaiHttp);
chai.should();

// SetUp the first Unit Test: 
// If the ser is up, GET-> /api/v1/b must return a responde statusCode 200 and an Object 'Books'
describe('Books', () => {
	describe('GET /b', () => {
		it('should ger all books', (done) => {
			chai
				.request(app)
				.get('/api/v1/b')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				});
		});
	});
});

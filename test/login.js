const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const dotenv = require('dotenv');
dotenv.config();

describe('TEST AUTHENTICATION', () => {

  it('SUCCESS, Login successful, token generated', (done) => {
    chai.request(app)
      .post('/login')
      .send({ username: 'FRANK', password: 'password' })
      .end((err, res) => {
        const body = res.body;
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('token');
        done();
      });
  });

  it('FAILURE, Returns status 400, Login unsuccessful', (done) => {
    chai.request(app)
      .post('/login')
      .send({ username: 'FRANK' })
      .end(() => {
        done();
      });
  });
});

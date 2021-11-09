const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
chai.use(chaiHttp);

describe('Testing POST on /api/login ', () => {
  it('It should verify the login request body return a JWT token and userId', (done) => {
    const login = {
      username: 'User1',
      password: '123456789',
    };
    chai.request(app)
      .post('/api/login')
      .send(login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        res.body.should.have.property('id');
        done();
      });
  });
});

describe('Testing POST on /api/jsonpatch ', () => {
  it('It should verify the JWT token, accept the jsonBody, apply the jsonPatch and return the resulting patched JSON object', (done) => {
    const jsonPatchRequest = {
      jsonBody: {
        _id: '001',
        username: 'User1',
        password: '123456789',
      },
      jsonPatch: [{
        op: 'replace', path: '/username', value: 'PatchUser',
      }],
    };
    chai.request(app)
      .post('/api/jsonpatch')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjAwMSIsInVzZXJuYW1lIjoiVXNlcjEiLCJwYXNzd29yZCI6IjEyMzQ1Njc4OSJ9LCJpYXQiOjE2MzU5NTY0MzUsImV4cCI6MTYzNTk2MDAzNX0.974wFanFlRNdyp66ELHwCniIC3F5a6mwmc8ij55ndDE')
      .send(jsonPatchRequest)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('_id').equal('001');
        res.body.should.have.property('username').equal('PatchUser');
        res.body.should.have.property('password').equal('123456789');
        done();
      });
  });
});

describe('Testing POST on /api/thumbnail ', () => {
  it('It should verify the JWT token, accept the image Body request. It should download the image, resize the image to 50x50 pixels, and return the generated thumbnail.', (done) => {
    const thumbnailRequest = {
      image: 'https://source.unsplash.com/random',
    };
    chai.request(app)
      .post('/api/thumbnail')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjAwMSIsInVzZXJuYW1lIjoiVXNlcjEiLCJwYXNzd29yZCI6IjEyMzQ1Njc4OSJ9LCJpYXQiOjE2MzU5NTY0MzUsImV4cCI6MTYzNTk2MDAzNX0.974wFanFlRNdyp66ELHwCniIC3F5a6mwmc8ij55ndDE')
      .send(thumbnailRequest)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

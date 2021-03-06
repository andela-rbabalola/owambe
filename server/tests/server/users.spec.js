import chai from 'chai';
import supertest from 'supertest';
import app from '../../../server';
import testHelper from '../helpers/testHelper';

const server = supertest.agent(app);
const expect = chai.expect;

let userDetails;
const user = testHelper.user();

describe('Users Test Suite', () => {
  before((done) => {
    server.post('/api/users')
      .type('form')
      .send(user)
      .end((error, res) => {
        userDetails = res.body;
        done();
      });
  });

  describe('Authentication', () => {
    const testUser = testHelper.user();
    it('Should create user given valid details', (done) => {
      server.post('/api/users')
        .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
        .type('form')
        .send(testUser)
        .end((error, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal('New user created');
          expect(res.body).to.have.property('newUser');
          expect(res.body.newUser).to.have.property('username');
          expect(res.body.newUser).to.have.property('email');
          done();
        });
    });

    it('Should allow only unique users to be created', (done) => {
      server.post('/api/users')
        .send(testUser)
        .expect(409)
        .end((err, res) => {
          expect(res.body.message.includes('already exists')).to.equal(true);
          done();
        });
    });

    it('Should set admin to false when user is created', (done) => {
      const anotherUser = testHelper.user();
      server.post('/api/users')
        .send(anotherUser)
        .end((error, res) => {
          expect(res.body.newUser).to.have.property('isAdmin');
          expect(res.body.newUser.isAdmin).to.equal(false);
          done();
        });
    });

    it('Should login a user with correct details', (done) => {
      server.post('/api/users/signin')
        .send({ email: user.email, password: user.password })
        .end((error, res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal('Signin successful');
          done();
        });
    });

    it('Should issue a token on successful signin', (done) => {
      server.post('/api/users/signin')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .end((error, res) => {
          expect(res.body).to.have.property('token');
          expect(res.body.token).not.to.equal(null);
          done();
        });
    });

    it('Should not return the password on login', (done) => {
      server.post('/api/users/signin')
        .send({ email: user.email, password: user.password })
        .end((error, res) => {
          expect(res.body.password).to.equal(undefined);
          done();
        });
    });

    it('Should deny access for wrong password', (done) => {
      server.post('/api/users/signin')
        .send({ email: user.email, password: 'wrong password' })
        .expect(401)
        .end((error, res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('Authentication failed! wrong password');
          done();
        });
    });

    it('Should fail if the user is not found', (done) => {
      server.post('/api/users/signin')
        .send({ email: 'wrong@email', password: user.password })
        .expect(404)
        .end((error, res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('Signin failed! User not found');
          done();
        });
    });

    it('Should validate email when creating a user', (done) => {
      server.post('/api/users/')
        .send({ email: 'invalid email', password: 'rotimi' })
        .expect(400)
        .end((error, res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('An error occured creating the user');
          done();
        });
    });
  });

  describe('Get Users', () => {
    it('Should return all users', (done) => {
      server.get('/api/users')
        .expect(200)
        .end((error, res) => {
          expect(res.body.users).to.be.instanceOf(Array);
          expect(res.body.users.length).to.be.greaterThan(0);
          done();
        });
    });

    it('Should return a particular user', (done) => {
      server.get(`/api/users/${userDetails.newUser.id}`)
        .expect(200)
        .end((error, res) => {
          expect(res.body.foundUser.id).to.equal(userDetails.newUser.id);
          expect(res.body.foundUser.username).to.equal(userDetails.newUser.username);
          done();
        });
    });
  });

  describe('Update user', () => {
    it('Should update a user', (done) => {
      server.put(`/api/users/${userDetails.newUser.id}`)
        .send({ username: 'updated username' })
        .expect(201)
        .end((error, res) => {
          expect(res.body.message).to.equal('User succesfully updated');
          expect(res.body.updatedUser.username).to.equal('updated username');
          done();
        });
    });
  });

  describe('Delete user', () => {
    it('Should delete a user', (done) => {
      server.delete(`/api/users/${userDetails.newUser.id}`)
        .end((error, res) => {
          expect(res.body.message).to.equal('User successfully deleted');
        });
      // Try to get user again after deleting
      server.get(`/api/users/${userDetails.newUser.id}`)
        .expect(404)
        .end((error, res) => {
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });
  });
});

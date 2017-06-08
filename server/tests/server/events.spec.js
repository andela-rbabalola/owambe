import chai from 'chai';
import supertest from 'supertest';
import app from '../../../server';
import testHelper from '../helpers/testHelper';

const server = supertest.agent(app);
const expect = chai.expect;

let eventDetails;
const event = testHelper.event();

/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */

describe('Events Test Suite', () => {
  before((done) => {
    server.post('/api/events')
      .type('form')
      .send(event)
      .end((error, res) => {
        eventDetails = res.body;
        done();
      });
  });

  describe('Creating an event', () => {
    const testEvent = testHelper.event();
    const testEventNoName = testHelper.eventNoName();
    const testEventNoDate = testHelper.eventNoDate();
    const onlineEvent = testHelper.onlineEvent();
    const onlineEventWithInvalidUrl = testHelper.onlineEventWithInvalidUrl();

    it('Should create an event given valid details', (done) => {
      server.post('/api/events')
        .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
        .type('form')
        .send(testEvent)
        .end((error, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal('New event created');
          expect(res.body.newEvent).to.have.property('eventName');
          expect(res.body.newEvent).to.have.property('eventDate');
          expect(res.body.newEvent).to.have.property('eventInformation');
          expect(res.body.newEvent).to.have.property('updatedAt');
          expect(res.body.newEvent).to.have.property('createdAt');
          expect(res.body.newEvent.eventInformation).to.have.property('city');
          expect(res.body.newEvent.eventInformation).to.have.property('state');
          expect(res.body.newEvent.eventInformation).to.have.property('address');
          done();
        });
    });

    it('Should create an online event', (done) => {
      server.post('/api/events')
        .send(onlineEvent)
        .end((error, res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal('New event created');
          expect(res.body.newEvent.eventUrl).to.not.equal(undefined);
          expect(res.body.newEvent.isOnline).to.equal(true);
          expect(res.body.newEvent).to.have.property('updatedAt');
          expect(res.body.newEvent).to.have.property('createdAt');
          expect(res.body.newEvent).to.have.property('eventInformation');
          expect(res.body.newEvent.eventInformation).to.have.property('city');
          expect(res.body.newEvent.eventInformation).to.have.property('state');
          expect(res.body.newEvent.eventInformation).to.have.property('address');
          done();
        });
    });

    it('Should allow only unique events to be created', (done) => {
      server.post('/api/events')
        .send(testEvent)
        .expect(409)
        .end((err, res) => {
          expect(res.body.message.includes('already exists')).to.equal(true);
          done();
        });
    });

    it('Should not create an event without a name', (done) => {
      server.post('/api/events')
        .send(testEventNoName)
        .end((error, res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('An error occured creating the event');
          expect(res.body.err.errors.eventName.message).to.equal('Path `eventName` is required.');
          done();
        });
    });

    it('Should not create an event without a date', (done) => {
      server.post('/api/events')
        .send(testEventNoDate)
        .end((error, res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('An error occured creating the event');
          expect(res.body.err.errors.eventDate.message).to.equal('Path `eventDate` is required.');
          done();
        });
    });

    it('Should not create an online event with an invalid url', (done) => {
      server.post('/api/events')
        .send(onlineEventWithInvalidUrl)
        .end((error, res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('An error occured creating the event');
          expect(res.body.err.errors.eventUrl.message).to.equal('Invalid url.');
          done();
        });
    });

    it('Should set isOnline to false if no eventUrl is passed', (done) => {
      server.post('/api/events')
        .send(testHelper.event())
        .end((error, res) => {
          expect(res.body.newEvent.isOnline).to.equal(false);
          done();
        });
    });

    it('Should have attendees as an empty array when created', (done) => {
      server.post('/api/events')
        .send(testHelper.event())
        .end((error, res) => {
          expect(res.body.newEvent.attendees.length).to.equal(0);
          expect(Array.isArray(res.body.newEvent.attendees)).to.equal(true);
          done();
        });
    });
  });

  describe('Getting events', () => {
    it('Should get all events', (done) => {
      server.get('/api/events')
        .end((error, res) => {
          expect(Array.isArray(res.body.events)).to.equal(true);
          expect(res.body.events.length).to.be.greaterThan(0);
          done();
        });
    });

    it('Should return a particular event', (done) => {
      server.get(`/api/events/${eventDetails.newEvent._id}`)
        .expect(200)
        .end((error, res) => {
          // doing this to avoid long lines
          const foundEvent = res.body.foundEvent;
          expect(foundEvent._id).to.equal(eventDetails.newEvent._id);
          expect(foundEvent.eventName).to.equal(eventDetails.newEvent.eventName);
          expect(foundEvent.eventDate).to.equal(eventDetails.newEvent.eventDate);
          expect(foundEvent.eventInformation.city).to.equal(eventDetails.newEvent.eventInformation.city);
          expect(foundEvent.eventInformation.address).to.equal(eventDetails.newEvent.eventInformation.address);
          done();
        });
    });
  });

  describe('Update event', () => {

  });
});

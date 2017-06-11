import Event from '../models/event.models';
import controllerHelper from './helper.controllers';

/**
 * This class handles database CRUD operations for events collection
 */
class EventController {
  /**
   * Method to create an event
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res object
   */
  static createEvent(req, res) {
    // check request body for event name
    Event.findOne({ eventName: req.body.eventName }, (error, oldEvent) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      } else if (oldEvent) {
        return res.status(409)
          .send({
            success: false,
            message: `Event ${req.body.eventName} already exists`,
            error
          });
      }
      // create event
      const newEvent = new Event(req.body);
      newEvent.save((err) => {
        if (err) {
          return res.status(400)
            .send({
              success: false,
              message: 'An error occured creating the event',
              err
            });
        }

        return res.status(201)
          .send({
            success: true,
            message: 'New event created',
            newEvent
          });
      });
    });
  }

  /**
   * Method to get all users in the db
   *
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static getAllEvents(req, res) {
    Event.find({}, (error, events) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured getting all events',
            error
          });
      }

      return res.status(200)
        .send({
          success: true,
          events
        });
    });
  }

  /**
   * Method to update an event
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static updateEvent(req, res) {
    Event.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, updatedEvent) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      } else if (!updatedEvent) {
        return res.status(404)
          .send({
            success: false,
            message: 'Update failed! User not found'
          });
      } else if (!controllerHelper.isOwnerOfEvent(req.decoded, updatedEvent.eventOwner)) {
        return res.status(403)
          .send({ success: false, message: 'Unauthorized access' });
      }
      return res.status(201)
        .send({
          success: true,
          message: 'Event succesfully updated',
          updatedEvent
        });
    });
  }

  /**
   * Method to get an event by ID
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static getEventByID(req, res) {
    Event.findById(req.params.id, (error, foundEvent) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      } else if (!foundEvent) {
        return res.status(404)
          .send({
            success: false,
            message: 'Event not found'
          });
      } else if (!controllerHelper.isOwnerOfEvent(req.decoded, foundEvent.eventOwner)) {
        return res.status(403)
          .send({ success: false, message: 'Unauthorized access' });
      }
      return res.status(200)
        .send({
          success: true,
          foundEvent
        });
    });
  }

  /**
   * Method to delete an event
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static deleteEvent(req, res) {
    Event.findByIdAndRemove(req.params.id, (error, foundEvent) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      } else if (!controllerHelper.isOwnerOfEvent(req.decoded, foundEvent.eventOwner)) {
        return res.status(403)
          .send({ success: false, message: 'Unauthorized access' });
      }
      return res.status(201)
        .send({
          success: true,
          message: 'Event successfully deleted'
        });
    });
  }
}

export default EventController;

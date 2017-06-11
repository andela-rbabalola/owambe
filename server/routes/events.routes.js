import express from 'express';
import EventController from '../controllers/event.controllers';
import Authentication from '../middleware/authentication';

const router = express.Router();

router.route('/')
  .get(Authentication.decodeToken, Authentication.isAdmin, EventController.getAllEvents)
  .post(Authentication.decodeToken, EventController.createEvent);

router.route('/:id')
  .get(Authentication.decodeToken, EventController.getEventByID)
  .put(Authentication.decodeToken, EventController.updateEvent)
  .delete(Authentication.decodeToken, EventController.deleteEvent);

export default router;

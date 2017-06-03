import express from 'express';
import EventController from '../controllers/event.controllers';

const router = express.Router();

router.route('/')
  .get(EventController.getAllEvents)
  .post(EventController.createEvent);

router.route('/:id')
  .get(EventController.getEventByID)
  .put(EventController.updateEvent)
  .delete(EventController.deleteEvent);

export default router;

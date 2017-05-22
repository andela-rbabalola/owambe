import express from 'express';
import UserController from '../controllers/user.controllers';

const router = express.Router();

router.route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUser);

export default router;

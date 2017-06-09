import express from 'express';
import UserController from '../controllers/user.controllers';

const router = express.Router();

router.route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUser);

router.route('/:id')
  .get(UserController.getUserById)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

router.route('/seed')
  .post(UserController.seedUsers);

router.route('/signin')
  .post(UserController.signIn);

export default router;

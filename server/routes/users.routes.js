import express from 'express';
import UserController from '../controllers/user.controllers';
import Authentication from '../middleware/authentication';

const router = express.Router();

router.route('/')
  .get(Authentication.decodeToken, Authentication.isAdmin, UserController.getAllUsers)
  .post(UserController.createUser);

router.route('/:id')
  .get(Authentication.decodeToken, Authentication.validateUser, UserController.getUserById)
  .put(Authentication.decodeToken, Authentication.validateUser, UserController.updateUser)
  .delete(Authentication.decodeToken, Authentication.isAdmin, UserController.deleteUser);

router.route('/seed')
  .post(UserController.seedUsers);

router.route('/signin')
  .post(UserController.signIn);

export default router;

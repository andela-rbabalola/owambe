import jwt from 'jsonwebtoken';
import User from '../models/user.models';

const secret = process.env.secret || 'owambe secret';

/* eslint no-underscore-dangle: 0*/

/**
 * This class handles database CRUD operations for users collection
 */
class UserController {
  /**
   * Method to create a user
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res object
   */
  static createUser(req, res) {
    // check request body for username
    User.findOne({ email: req.body.email }, (err, oldUser) => {
      if (err) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            err
          });
      } else if (oldUser) {
        return res.status(409)
          .send({
            success: false,
            message: `${req.body.email} already exists`
          });
      }
      // create user
      const newUser = new User(req.body);
      newUser.provider = 'local';
      newUser.isAdmin = false;
      newUser.save((err) => {
        if (err) {
          return res.status(500)
            .send({
              success: false,
              message: 'An error occured creating the user',
              err
            });
        }
        const token = jwt.sign({
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username,
          isAdmin: newUser.isAdmin
        }, secret, { expiresIn: '3 days' });

        return res.status(201)
          .send({
            success: true,
            message: 'New user created',
            newUser,
            token,
            expiresIn: '3 days'
          });
      });
    });
  }

  /**
   * Method to get all users in the db
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res object
   */
  static getAllUsers(req, res) {
    // test first --> works
    res.send();
  }
}

export default UserController;

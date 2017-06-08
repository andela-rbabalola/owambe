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
    User.findOne({ email: req.body.email }, (error, oldUser) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
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
      newUser.save((err) => {
        if (err) {
          return res.status(400)
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
            newUser: {
              __v: newUser.__v,
              id: newUser._id,
              username: newUser.username,
              email: newUser.email,
              isAdmin: newUser.isAdmin,
              provider: newUser.provider,
              createdAt: newUser.createdAt,
              updatedAt: newUser.updatedAt
            },
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
   * @return {Object} res object
   */
  static getAllUsers(req, res) {
    User.find({}, (error, users) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured getting all users',
            error
          });
      }

      return res.status(200)
        .send({
          success: true,
          users
        });
    });
  }

  /**
   * Method to sign in a user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static signIn(req, res) {
    User.findOne({ email: req.body.email }, (error, oldUser) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      } else if (!oldUser) {
        // return user not found
        return res.status(404)
          .send({
            success: false,
            message: 'Signin failed! User not found'
          });
      }
      if (oldUser.authenticate(req.body.password)) {
        const token = jwt.sign({
          userId: oldUser._id,
          email: oldUser.email,
          username: oldUser.username,
          isAdmin: oldUser.isAdmin
        }, secret, { expiresIn: '3 days' });

        // send the users details
        return res.status(200)
          .send({
            success: true,
            message: 'Signin successful',
            token
          });
      }
      // if authentication failed return user not found
      return res.status(401)
        .send({
          success: false,
          message: 'Authentication failed! wrong password'
        });
    });
  }

  /**
   * Method to update a user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, updatedUser) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      } else if (!updatedUser) {
        // return user not found
        return res.status(404)
          .send({
            success: false,
            message: 'Update failed! User not found'
          });
      }
      // return updated user
      return res.status(201)
        .send({
          success: true,
          message: 'User succesfully updated',
          updatedUser: {
            __v: updatedUser.__v,
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            provider: updatedUser.provider,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
          }
        });
    });
  }

  /**
   * Method to get a user by ID
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static getUserById(req, res) {
    User.findById(req.params.id, (error, foundUser) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      } else if (!foundUser) {
        return res.status(404)
          .send({
            success: false,
            message: 'User not found'
          });
      }
      return res.status(200)
        .send({
          success: true,
          foundUser: {
            __v: foundUser.__v,
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin,
            provider: foundUser.provider,
            createdAt: foundUser.createdAt,
            updatedAt: foundUser.updatedAt
          }
        });
    });
  }

  /**
   * Method to delete a user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res object
   */
  static deleteUser(req, res) {
    User.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        return res.status(500)
          .send({
            success: false,
            message: 'An error occured',
            error
          });
      }
      return res.status(201)
        .send({
          success: true,
          message: 'User successfully deleted'
        });
    });
  }
}

export default UserController;

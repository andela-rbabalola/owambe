import jwt from 'jsonwebtoken';

const secret = process.env.secret || 'owambe secret';

/**
 * Class to handle authentication for endpoints
 */
class Authentication {
  /**
   * Method to decode and verify a supplied token
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res object
   */
  static decodeToken(req, res, next) {
    const token = req.body.token || req.headers.authorization || req.headers['x-access-token'];
    if (!token) {
      return res.status(401)
        .send({ success: false, message: 'Supply a token for this route' });
    }
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.json({ success: false, message: 'Failed to authenticate token' });
      }
      req.decoded = decoded;
      next();
    });
  }

  /**
   * Method to verify if a user is the admin
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res object
   */
  static isAdmin(req, res, next) {
    if (req.decoded.isAdmin === true) {
      next();
    } else {
      return res.status(403)
        .send({ success: false, message: 'You do not have Admin rights' });
    }
  }

  /**
   * Method to validate a user. Checks that the id param in the request object
   * matches the userId in the JWT token
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res object
   */
  static validateUser(req, res, next) {
    if (req.params.id !== req.decoded.userId.toString() && !req.decoded.isAdmin) {
      return res.status(403)
        .send({ success: false, message: 'Unauthorized access' });
    }
    next();
  }
}

export default Authentication;

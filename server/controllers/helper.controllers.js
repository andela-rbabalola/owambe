import User from '../models/user.models';

/**
 * Helper function for controllers
 */
class controllerHelper {
  /**
   * Method to validate if a user is the owner of an event. Only allows access if the requester
   * is the admin or the owner of the event
   *
   * @param {Object} decoded
   * @param {Object} eventOwnerId
   * @returns {Boolean} boolean confirming ownership of event
   */
  static isOwnerOfEvent(decoded, eventOwnerId) {
    if (decoded.userId !== eventOwnerId && !decoded.isAdmin) {
      return false;
    }
    return true;
  }

  /**
   * Method to validate if a userId belongs to the admin
   *
   * @param {Object} userId
   * @returns {Boolean} boolean confirming ownership of event
   */
  static isAdmin(userId) {
    User.findById(userId, (error, foundUser) => {
      if (foundUser.isAdmin) {
        console.log('+++++++++++', userId);
        return true;
      }
      return false;
    });
  }
}

export default controllerHelper;

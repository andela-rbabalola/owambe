import faker from 'faker';

/**
 * Helper class to generate data
 */
export default class testHelper {
  /**
   * Creates a dummy user
   * @returns {obj} - Object with dummy user details
   */
  static user() {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  }

  /**
   * Creates a dummy event
   * @param {String} userId - Id for owner of the event
   * @returns {obj} - Object with dummy user details
   */
  static event(userId) {
    return {
      eventName: faker.lorem.words(),
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      },
      eventOwner: userId
    };
  }

  /**
   * Creates a dummy event without a name
   * @param {String} userId - Id for owner of the event
   * @returns {obj} - Object with dummy user details
   */
  static eventNoName(userId) {
    return {
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      },
      eventOwner: userId
    };
  }

  /**
   * Creates a dummy event without a date
   * @param {String} userId - Id for owner of the event
   * @returns {obj} - Object with dummy user details
   */
  static eventNoDate(userId) {
    return {
      eventName: faker.lorem.words(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      },
      eventOwner: userId
    };
  }

  /**
   * Creates a dummy online event
   * @param {String} userId - Id for owner of the event
   * @returns {obj} - Object with dummy user details
   */
  static onlineEvent(userId) {
    return {
      eventName: faker.lorem.words(),
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      },
      eventUrl: faker.internet.url(),
      eventOwner: userId
    };
  }

  /**
   * Creates a dummy online event with an invalid url
   * @param {String} userId - Id for owner of the event
   * @returns {obj} - Object with dummy user details
   */
  static onlineEventWithInvalidUrl(userId) {
    return {
      eventName: faker.lorem.words(),
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      },
      eventUrl: 'invalid url',
      eventOwner: userId
    };
  }

  /**
   * Creates a dummy online event with an owner
   * @param {String} userId - Id for owner of the event
   * @returns {obj} - Object with dummy user details
   */
  static eventWithoutOwner() {
    return {
      eventName: faker.lorem.words(),
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      },
      eventUrl: 'invalid url'
    };
  }

  /**
   * Creates a dummy online event with any kind of address
   * @param {String} userId - Id for owner of the event
   * @returns {obj} - Object with dummy user details
   */
  static eventWithoutAnyAddress(userId) {
    return {
      eventName: faker.lorem.words(),
      eventDate: faker.date.future(),
      eventOwner: userId
    };
  }
}

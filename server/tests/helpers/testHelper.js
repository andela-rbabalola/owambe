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
   * @returns {obj} - Object with dummy user details
   */
  static event() {
    return {
      eventName: faker.lorem.words(),
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      }
    };
  }

  /**
   * Creates a dummy event without a name
   * @returns {obj} - Object with dummy user details
   */
  static eventNoName() {
    return {
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      }
    };
  }

  /**
   * Creates a dummy event without a date
   * @returns {obj} - Object with dummy user details
   */
  static eventNoDate() {
    return {
      eventName: faker.lorem.words(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      }
    };
  }

  /**
   * Creates a dummy online event
   * @returns {obj} - Object with dummy user details
   */
  static onlineEvent() {
    return {
      eventName: faker.lorem.words(),
      eventDate: faker.date.future(),
      eventInformation: {
        address: faker.address.streetAddress(),
        state: faker.address.state(),
        city: faker.address.city()
      },
      eventUrl: faker.internet.url()
    };
  }

  /**
   * Creates a dummy online event with an invalid url
   * @returns {obj} - Object with dummy user details
   */
  static onlineEventWithInvalidUrl() {
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
}

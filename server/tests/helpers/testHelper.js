import faker from 'faker';

/**
 * Helper class to generate data
 */
export default class testHelper {
  /**
   * Create a dummy user
   * @returns {obj} - Object with dummy user details
   */
  static user() {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  }
}

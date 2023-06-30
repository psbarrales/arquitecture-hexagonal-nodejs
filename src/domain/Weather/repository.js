/**
 * @interface
 * @exports Repository
 * Interface for the Repository, following the Hexagonal Architecture pattern.
 * This interface defines the methods that a repository should implement.
 */
export default class WheatherRepositoryInterface {
  /**
     * A method to update the data stored in the repository.
      This method should return a Promise that resolves to the same data updated.
      @abstract
      @param {Weather} weather
      @returns {Promise<Weather>} A Promise that resolves to a response with all the data updated in the repository.
      @throws {Error} If there's an error accessing the repository.
     */
  async update(weather) {
    throw new Error(
      'WheatherRepositoryInterface "update" method not implemented!'
    );
  }

  /**
     * A method to get the first object on data stored in the repository.
      This method should return a Promise that resolves a {Weather} object.
      @abstract
      @returns {Promise<Weather>} A Promise that resolves to a response with the first Weather in the repository.
      @throws {Error} If there's an error accessing the repository.
     */
  async findFirst() {
    throw new Error(
      'WheatherRepositoryInterface "findFirst" method not implemented!'
    );
  }
}

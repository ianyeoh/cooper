import { faker } from "@faker-js/faker";

export function generateUser() {
  return {
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
  };
}

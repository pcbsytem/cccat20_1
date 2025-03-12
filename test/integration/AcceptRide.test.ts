import { faker } from '@faker-js/faker/.';
import Signup from '../../src/application/usecase/Signup';
import RequestRide from '../../src/application/usecase/RequestRide';
import AcceptRide from '../../src/application/usecase/AcceptRide';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import Registry from '../../src/infra/di/Registry';

let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let databaseConnection: PgPromiseAdapter

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  Registry.getInstance().provide("databaseConnection", databaseConnection);
  const accountRepository = new AccountRepositoryDatabase();
  const rideRepository = new RideRepositoryDatabase();
  Registry.getInstance().provide("accountRepository", accountRepository);
  Registry.getInstance().provide("rideRepository", rideRepository);
  signup = new Signup();
  requestRide = new RequestRide();
  acceptRide = new AcceptRide();
});

test("Deve aceitar uma corrida", async () => {
  const inputPassenger = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputPassenger = await signup.execute(inputPassenger)
  const inputDriver = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA9999',
    isDriver: true,
  }
  const outputDriver = await signup.execute(inputDriver)
  const inputRequestRide = {
    passengerId: outputPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const inputAcceptRide = {
    driverId: outputDriver.accountId,
    rideId: outputRequestRide.rideId
  }
  const outputAcceptRide = await acceptRide.execute(inputAcceptRide);
  expect(outputRequestRide.rideId).toBe(outputAcceptRide.rideId);
});

test("Não deve aceitar uma corrida se não for um motorista", async () => {
  const inputPassenger = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputPassenger = await signup.execute(inputPassenger)
  const inputDriver = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputDriver = await signup.execute(inputDriver)  
  const inputRequestRide = {
    passengerId: outputPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const inputAcceptRide = {
    driverId: outputDriver.accountId,
    rideId: outputRequestRide.rideId
  }
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("The request must be a driver"));
});

test("Não deve aceitar uma corrida se o motorista tiver uma corrida em andamento", async () => {
  const inputPassenger = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputPassenger = await signup.execute(inputPassenger)
  const inputDriver = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA9999',
    isDriver: true,
  }
  const outputDriver = await signup.execute(inputDriver)
  const inputRequestRide = {
    passengerId: outputPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const inputAcceptRide = {
    driverId: outputDriver.accountId,
    rideId: outputRequestRide.rideId
  }
  await acceptRide.execute(inputAcceptRide)
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("The request already have an active ride"));
});
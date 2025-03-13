import { faker } from '@faker-js/faker/.';
import Signup from '../../src/application/usecase/Signup';
import RequestRide from '../../src/application/usecase/RequestRide';
import AcceptRide from '../../src/application/usecase/AcceptRide';
import StartRide from '../../src/application/usecase/StartRide';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import Registry from '../../src/infra/di/Registry';

let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
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
  startRide = new StartRide();
});

test("Deve iniciar uma corrida", async () => {
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
  const outputStartRide = await startRide.execute(inputAcceptRide);
  expect(outputRequestRide.rideId).toBe(outputStartRide.rideId);
});

test("Não deve iniciar uma corrida se o motorista já tiver uma corrida em andamento", async () => {
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
  await startRide.execute(inputAcceptRide)
  await expect(() => startRide.execute(inputAcceptRide)).rejects.toThrow(new Error("The request already have an active ride"));
});
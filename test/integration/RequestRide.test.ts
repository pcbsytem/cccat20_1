import { faker } from '@faker-js/faker/.';
import RequestRide from '../../src/application/usecase/RequestRide'
import Signup from '../../src/application/usecase/Signup';
import GetRide from '../../src/application/usecase/GetRide';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import Registry from '../../src/infra/di/Registry';
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepository';

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: PgPromiseAdapter

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  Registry.getInstance().provide("databaseConnection", databaseConnection);
  const accountRepository = new AccountRepositoryDatabase();
  const rideRepository = new RideRepositoryDatabase();
  const positionRepository = new PositionRepositoryDatabase();
  Registry.getInstance().provide("accountRepository", accountRepository);
  Registry.getInstance().provide("rideRepository", rideRepository);
  Registry.getInstance().provide("positionRepository", positionRepository);
  signup = new Signup();
  requestRide = new RequestRide();
  getRide = new GetRide();
});

test("Deve solicitar uma corrida", async () => {  
  const inputSignup = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.545022195325124,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
  expect(outputGetRide.fare).toBe(21);
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.status).toBe("requested");
});

test("Não deve solicitar uma corrida se não for um passageiro", async () => {
  const inputSignup = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA9999',
    isDriver: true,
  }
  const outputSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.545022195325124,
  }
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The request must be a passenger"));
});

test("Não deve solicitar uma corrida se o passageiro já tiver uma corrida em andamento", async () => {
  const inputSignup = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.545022195325124,
  }
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The request already have an active ride"));
});

test("Não deve solicitar uma corrida se latitude ou longitude estiverem inválidas", async () => {
  const inputSignup = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -140,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.545022195325124,
  }
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The latitude is invalid"));
});

afterEach(async () => {
  await databaseConnection.close()
});

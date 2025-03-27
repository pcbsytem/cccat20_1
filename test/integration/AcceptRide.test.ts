import { faker } from '@faker-js/faker/.';
import Signup from '../../src/application/usecase/Signup';
import RequestRide from '../../src/application/usecase/RequestRide';
import AcceptRide from '../../src/application/usecase/AcceptRide';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import Registry from '../../src/infra/di/Registry';
import GetRide from '../../src/application/usecase/GetRide';

let databaseConnection: PgPromiseAdapter
let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;

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
  getRide = new GetRide();
});

test("Deve aceitar uma corrida", async () => {
  const inputSignUpPassenger = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignUpPassenger = await signup.execute(inputSignUpPassenger)
  const inputSignUpDriver = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
  }
  const outputSignUpDriver = await signup.execute(inputSignUpDriver)
  const inputRequestRide = {
    passengerId: outputSignUpPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignUpDriver.accountId
  }
  await acceptRide.execute(inputAcceptRide);

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.driverId).toBe(outputSignUpDriver.accountId);
  expect(outputGetRide.status).toBe("accepted");
});

test("Não deve aceitar uma corrida de uma conta que não é motorista", async () => {
  const inputSignUpPassenger = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignUpPassenger = await signup.execute(inputSignUpPassenger)
  const inputSignUpDriver = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignUpDriver = await signup.execute(inputSignUpDriver)
  const inputRequestRide = {
    passengerId: outputSignUpPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignUpDriver.accountId
  }
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("The account must be from a driver"));
});

afterEach(async () => {
  await databaseConnection.close()
});

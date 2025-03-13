import { faker } from '@faker-js/faker/.';
import Signup from '../../src/application/usecase/Signup';
import RequestRide from '../../src/application/usecase/RequestRide';
import AcceptRide from '../../src/application/usecase/AcceptRide';
import StartRide from '../../src/application/usecase/StartRide';
import UpdatePosition from '../../src/application/usecase/UpdatePosition';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import Registry from '../../src/infra/di/Registry';
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepository';

let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
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
  acceptRide = new AcceptRide();
  startRide = new StartRide();
  updatePosition = new UpdatePosition();
});

test("Deve atualizar a posição da corrida", async () => {
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
  expect(outputAcceptRide.rideId).toBeDefined();
  const outputStartRide = await startRide.execute(inputAcceptRide);
  expect(outputStartRide.rideId).toBeDefined();
  const inputUpdatePosition = {
    rideId: outputRequestRide.rideId,
    latitude: -27.584905257808835,
    longitude: -48.545022195325124
  }
  const outputUpdatePosition = await updatePosition.execute(inputUpdatePosition);
  expect(outputUpdatePosition.positionId).toBeDefined();
});

test("Não deve atualizar a posição da corrida se a corrida não estiver em andamento", async () => {
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
  expect(outputAcceptRide.rideId).toBeDefined();
  const inputUpdatePosition = {
    rideId: outputRequestRide.rideId,
    latitude: -27.584905257808835,
    longitude: -48.545022195325124
  }
  await expect(() => updatePosition.execute(inputUpdatePosition)).rejects.toThrow(new Error("The request already have an active ride"));
});
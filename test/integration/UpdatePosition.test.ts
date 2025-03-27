import { faker } from '@faker-js/faker/.';
import Signup from '../../src/application/usecase/Signup';
import RequestRide from '../../src/application/usecase/RequestRide';
import AcceptRide from '../../src/application/usecase/AcceptRide';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import Registry from '../../src/infra/di/Registry';
import GetRide from '../../src/application/usecase/GetRide';
import StartRide from '../../src/application/usecase/StartRide';
import UpdatePosition from '../../src/application/usecase/UpdatePosition';
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepository';

let databaseConnection: PgPromiseAdapter
let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let getRide: GetRide;

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
  getRide = new GetRide();
});

test("Deve atualizar a posição de uma corrida", async () => {
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

  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignUpDriver.accountId
  }
  await acceptRide.execute(inputAcceptRide);

  const inputStartRide = {
    rideId: outputRequestRide.rideId
  }
  await startRide.execute(inputStartRide);

  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
		long: -48.545022195325124
  }

  await updatePosition.execute(inputUpdatePosition1)

  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }

  await updatePosition.execute(inputUpdatePosition2)

  const inputUpdatePosition3 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
		long: -48.545022195325124
  }

  await updatePosition.execute(inputUpdatePosition3)

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("in_progress");
  expect(outputGetRide.distance).toBe(20);
});

afterEach(async () => {
  await databaseConnection.close()
});

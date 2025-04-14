import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import {
  AccountRepositoryDatabase,
  AccountRepositoryMemory,
  AccountRepositoryORM
} from '../../src/infra/repository/AccountRepository';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import GetAccount from '../../src/application/usecase/GetAccount';
import Registry from '../../src/infra/di/Registry';
import Signup from '../../src/application/usecase/Signup';
import { Account } from '../../src/domain/entity/Account';
import ORM from '../../src/infra/ORM/ORM';

let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  Registry.getInstance().provide('databaseConnection', databaseConnection);
  const orm = new ORM();
  Registry.getInstance().provide('orm', orm);
  const accountRepository = new AccountRepositoryORM();
  // const accountRepository = new AccountRepositoryDatabase()
  // const accountRepository = new AccountRepositoryMemory()
  Registry.getInstance().provide('accountRepository', accountRepository);
  signup = new Signup();
  getAccount = new GetAccount();
});

test('Deve fazer a criação da conta de um usuário do tipo passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
});

test('Deve fazer a criação da conta de um usuário do tipo motorista', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
});

test('Não deve fazer a criação da conta de uma usuário se o nome for inválido', async () => {
  const input = {
    name: 'John',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid name')
  );
});

test('Não deve fazer a criação da conta de uma usuário se o email for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid email')
  );
});

test('Não deve fazer a criação da conta de uma usuário se o cpf for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '9745632155',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid cpf')
  );
});

test('Não deve fazer a criação da conta de uma usuário se o password for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE',
    isPassenger: true
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid password')
  );
});

test('Não deve fazer a criação da conta de uma usuário se a conta estiver duplicada', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Account already exists')
  );
});

test('Não deve fazer a criação da conta de uma usuário se a placa for inválida', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA999',
    isDriver: true,
    isPassenger: false
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid carPlate')
  );
});

// Test Patterns

test('Deve fazer a criação da conta de um usuário do tipo passageiro com stub', async () => {
  const input: any = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  const saveAccountStub = sinon
    .stub(AccountRepositoryDatabase.prototype, 'saveAccount')
    .resolves();
  const getAccountByEmailStub = sinon
    .stub(AccountRepositoryDatabase.prototype, 'getAccountByEmail')
    .resolves();
  const getAccountByIdStub = sinon
    .stub(AccountRepositoryDatabase.prototype, 'getAccountById')
    .resolves(
      Account.create(
        input.name,
        input.email,
        input.cpf,
        input.password,
        input.carPlate,
        input.isPassenger,
        input.isDriver
      )
    );
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  saveAccountStub.restore();
  getAccountByEmailStub.restore();
  getAccountByIdStub.restore();
});

test('Deve fazer a criação da conta de um usuário do tipo passageiro com spy', async () => {
  const saveAccountSpy = sinon.spy(
    AccountRepositoryORM.prototype,
    'saveAccount'
  );
  const getAccountByIdSpy = sinon.spy(
    AccountRepositoryORM.prototype,
    'getAccountById'
  );
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(saveAccountSpy.calledOnce).toBe(true);
  expect(getAccountByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
  saveAccountSpy.restore();
  getAccountByIdSpy.restore();
});

test('Deve fazer a criação da conta de um usuário do tipo passageiro com mock', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  const accountRepositoryMock = sinon.mock(AccountRepositoryDatabase.prototype);
  accountRepositoryMock.expects('saveAccount').once().resolves();
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  accountRepositoryMock
    .expects('getAccountById')
    .once()
    .withArgs(outputSignup.accountId)
    .resolves(
      Account.create(
        input.name,
        input.email,
        input.cpf,
        input.password,
        input.carPlate,
        input.isPassenger,
        input.isDriver
      )
    );
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  accountRepositoryMock.restore();
});

test('Deve fazer a criação da conta de um usuário do tipo passageiro com fake', async () => {
  const accountRepository = new AccountRepositoryMemory();
  Registry.getInstance().provide('accountRepository', accountRepository);
  const signup = new Signup();
  const getAccount = new GetAccount();
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
});

afterEach(async () => {
  await databaseConnection.close();
});

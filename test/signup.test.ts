import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import Signup from '../src/signup';
import GetAccount from '../src/getAccount';
import { AccountDAODatabase, AccountDAOMemory } from '../src/data';
import { get } from 'http';

let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
  const accountDAO = new AccountDAODatabase()
  signup = new Signup(accountDAO)
  getAccount = new GetAccount(accountDAO)
})

test('Deve fazer a criação da conta de um usuário do tipo passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
});

test('Deve fazer a criação da conta de um usuário do tipo motorista', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA9999',
    isDriver: true,
  }
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
});

test('Não deve fazer a criação da conta de uma usuário se o nome for inválido', async () => {
  const input = {
    name: 'John',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test('Não deve fazer a criação da conta de uma usuário se o email for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"))
});

test('Não deve fazer a criação da conta de uma usuário se o cpf for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '9745632155',
    password: 'asdQWE123',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"))
});

test('Não deve fazer a criação da conta de uma usuário se o password for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid password"))
});

test('Não deve fazer a criação da conta de uma usuário se a conta estiver duplicada', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  await signup.execute(input)
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"))
});

test('Não deve fazer a criação da conta de uma usuário se a placa for inválida', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: 'AAA999',
    isDriver: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"))
});

// Test Patterns

test('Deve fazer a criação da conta de um usuário do tipo passageiro com stub', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, 'saveAccount').resolves();
  const getAccountByEmailStub = sinon.stub(AccountDAODatabase.prototype, 'getAccountByEmail').resolves();
  const getAccountByIdStub = sinon.stub(AccountDAODatabase.prototype, 'getAccountById').resolves(input);
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
  saveAccountStub.restore()
  getAccountByEmailStub.restore()
  getAccountByIdStub.restore()
});

test('Deve fazer a criação da conta de um usuário do tipo passageiro com spy', async () => {
  const saveAccountSpy = sinon.spy(AccountDAODatabase.prototype, 'saveAccount');
  const getAccountByIdSpy = sinon.spy(AccountDAODatabase.prototype, 'getAccountById');
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
  expect(saveAccountSpy.calledOnce).toBe(true)
  expect(getAccountByIdSpy.calledWith(outputSignup.accountId)).toBe(true)
  saveAccountSpy.restore()
  getAccountByIdSpy.restore()
});

test('Deve fazer a criação da conta de um usuário do tipo passageiro com mock', async () => {
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const accountDAOMock = sinon.mock(AccountDAODatabase.prototype)
  accountDAOMock.expects('saveAccount').once().resolves()
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  accountDAOMock.expects('getAccountById').once().withArgs(outputSignup.accountId).resolves(input)
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
  accountDAOMock.verify()
  accountDAOMock.restore()
});

test('Deve fazer a criação da conta de um usuário do tipo passageiro com fake', async () => {
  const accountDAO = new AccountDAOMemory()
  const signup = new Signup(accountDAO)
  const getAccount = new GetAccount(accountDAO)
  const input = {
    name: 'John Doe',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
});


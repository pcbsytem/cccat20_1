import axios from 'axios';
import { faker } from '@faker-js/faker';

axios.defaults.validateStatus = () => true;

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
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    input
  );
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test('Não deve fazer a criação da conta de uma usuário se o nome for inválido', async () => {
  const input = {
    name: 'John',
    email: faker.internet.email(),
    cpf: '97456321558',
    password: 'asdQWE123',
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    input
  );
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe('Invalid name');
});

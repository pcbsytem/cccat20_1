const request = require('supertest');
const app = require('../src/signup');
const { faker } = require('@faker-js/faker');

function generateCPF() {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const firstCheckDigit = calculateCheckDigit(digits, 10);
  digits.push(firstCheckDigit);
  const secondCheckDigit = calculateCheckDigit(digits, 11);
  digits.push(secondCheckDigit);
  return `${digits.slice(0, 3).join('')}.${digits.slice(3, 6).join('')}.${digits.slice(6, 9).join('')}-${digits.slice(9).join('')}`;
}

function calculateCheckDigit(digits: number[], weight: number) {
  const sum = digits.reduce((acc, digit, index) => acc + digit * (weight - index), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function generatePassword() {
  let password;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  do {
    password = faker.internet.password({
      length: 12,
      memorable: false,
      pattern: /[A-Za-z\d]/,
    });
  } while (!regex.test(password));

  return password;
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (let i = 0; i < cpf.length; i++) {
    total += parseInt(cpf[i]) * factor--;
  }
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function generateCarPlate() {
  const letters = faker.string.alpha({ length: 3, casing: 'upper' });
  const numbers = faker.string.numeric({ length: 4 });
  return `${letters}${numbers}`;
}

function generateName() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return `${firstName} ${lastName}`;
}

describe('Signup API', () => {
  test('Deve validar body com nome inválido', async () => {
    const response = await request('http://localhost:3000')
      .post('/signup')
      .send({
        name: '',
        email: 'test@example.com',
        password: 'password123',
        cpf: '12345678900',
        isDriver: false,
        carPlate: 'ABC-1234'
      });
    expect(response.status).toBe(422);
  });

  test('Deve validar body com email inválido', async () => {
    const response = await request('http://localhost:3000')
      .post('/signup')
      .send({
        name: 'test',
        email: 'test@example.com',
        password: 'password123',
        cpf: '12345678900',
        isDriver: false,
        carPlate: 'ABC-1234'
      });
    expect(response.status).toBe(422);
  });

  test('Deve validar body com password inválido', async () => {
    const response = await request('http://localhost:3000')
      .post('/signup')
      .send({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'SecurePass1*',
        cpf: '12345678900',
        isDriver: false,
        carPlate: 'ABC-1234'
      });
    expect(response.status).toBe(422);
  });

  test('Deve validar body com cpf inválido', async () => {
    const response = await request('http://localhost:3000')
      .post('/signup')
      .send({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'SecurePass1',
        cpf: '12345678900',
        isDriver: false,
        carPlate: 'ABC-1234'
      });
    expect(response.status).toBe(422);
  });

  test('Deve validar body com isDriver inválido', async () => {
    const response = await request('http://localhost:3000')
      .post('/signup')
      .send({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'SecurePass1',
        cpf: '39229903809',
        isDriver: false,
        carPlate: 'ABC-1234'
      });
    expect(response.status).toBe(422);
  });

  test('Deve validar body com carPlate inválido', async () => {
    const response = await request('http://localhost:3000')
      .post('/signup')
      .send({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'SecurePass1',
        cpf: '39229903809',
        isDriver: true,
        carPlate: 'ABC-123'
      });
    expect(response.status).toBe(422);
  });

  test('Deve fazer signup com sucesso', async () => {
    const response = await request('http://localhost:3000')
      .post('/signup')
      .send({
        name: generateName(),
        email: faker.internet.email(),
        password: generatePassword(),
        cpf: generateCPF(),
        isDriver: true,
        carPlate: generateCarPlate()
      });
    expect(response.status).toBe(200);
  });
});
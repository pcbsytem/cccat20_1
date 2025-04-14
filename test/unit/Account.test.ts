import { faker } from '@faker-js/faker';
import { Account } from '../../src/domain/entity/Account';

test('Deve criar uma conta de motorista', () => {
  const account = Account.create(
    'John Doe',
    faker.internet.email(),
    '97456321558',
    'asdQWE123',
    'AAA9999',
    false,
    true
  );
  expect(account).toBeDefined();
});

test('Nao deve criar uma conta de passageiro com accountId inválido', () => {
  expect(
    () =>
      new Account(
        '1',
        'John Doe',
        faker.internet.email(),
        '97456321558',
        'asdQWE123',
        'AAA9999',
        true,
        false
      )
  ).toThrow(new Error('Invalid UUID'));
});

test('Nao deve criar uma conta de motorista com placa inválida', () => {
  expect(() =>
    Account.create(
      'John Doe',
      faker.internet.email(),
      '97456321558',
      'asdQWE123',
      'AAA999',
      false,
      true
    )
  ).toThrow(new Error('Invalid carPlate'));
});

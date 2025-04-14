import Cpf from '../../src/domain/vo/Cpf';

test.each(['97456321558', '71428793860', '974.563.215-58', '714.287.938-60'])(
  'Deve validar um cpf %s',
  function (cpf: string) {
    expect(new Cpf(cpf)).toBeDefined();
  }
);

test.each(['', undefined, null, '11111111111'])(
  'Não deve validar um cpf %s',
  function (cpf: any) {
    expect(() => new Cpf(cpf)).toThrow(new Error('Invalid cpf'));
  }
);

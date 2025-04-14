import Password from '../../src/domain/vo/Password';

test.each(['asdFGH123', 'asdG123456', 'aG1aG129999'])(
  'Deve validar a senha %s',
  function (password: string) {
    expect(new Password(password)).toBeDefined();
  }
);

test.each(['', 'asD123', '12345678', 'asdfghjkl', 'ASDFGHJKL', 'asddfg123456'])(
  'Não deve validar a senha %s',
  function (password: string) {
    expect(() => new Password(password)).toThrow(new Error('Invalid password'));
  }
);

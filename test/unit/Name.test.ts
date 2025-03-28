import { Name } from '../../src/domain/vo/Name';

test("Deve criar um nome válido", () => {
  const name = new Name("Jonas Silva");
  expect(name).toBeDefined()
})

test("Nao deve criar um nome inválido", () => {
  expect(() => new Name("Jonas")).toThrow(new Error("Invalid name"));
})
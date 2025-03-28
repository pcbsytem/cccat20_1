import { UUID } from '../../src/domain/vo/UUID';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import Registry from '../../src/infra/di/Registry';
import ORM from '../../src/infra/ORM/ORM';
import { AccountModel } from '../../src/infra/ORM/ORM';

test("Deve persistir usando um ORM", async () => {
  const connection = new PgPromiseAdapter();
  Registry.getInstance().provide("connection", connection);
  const orm = new ORM();
  const accountModel = new AccountModel(UUID.create().getValue(), "John Doe", "john.doe@gmail.com", "111.111.111-11");
  await orm.save(accountModel);
  // const persistedAccountModel = await orm.get(accountModel, "account_id", "uuid");
  // expect(persistedAccountModel.name).toBe("John Doe");
  // expect(persistedAccountModel.email).toBe("john.doe@gmail.com");
  // expect(persistedAccountModel.cpf).toBe("111.111.111-11");
})
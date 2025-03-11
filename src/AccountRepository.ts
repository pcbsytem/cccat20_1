import pgp from "pg-promise";
import { Account } from './Account';

export default interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>;
  getAccountById(accountId: string): Promise<Account>;
  saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  async getAccountByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query("select * from ccca.account where email = $1", [email]);
    await connection.$pool.end();
    if (!accountData) return;
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.password,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver,
    );
  }

  async getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.password,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver,
    );
  }

  async saveAccount(account: Account) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]
    );
    await connection.$pool.end();
  }
}
export class AccountRepositoryMemory implements AccountRepository {
  private accounts: Account[] = [];

  async getAccountByEmail(email: string): Promise<any> {
    return this.accounts.find((account) => account.email === email);
  }

  async getAccountById(accountId: string): Promise<any> {
    return this.accounts.find((account) => account.accountId === accountId);
  }

  async saveAccount(account: any) {
    this.accounts.push(account);
  }
}


import { inject } from '../di/Registry';
import DatabaseConnection from '../database/DatabaseConnection';

export default class ORM {
  @inject("connection")
  connection!: DatabaseConnection;

  async save (model: Model) {
    console.log(model)
  }
}

export class Model {
  schema!: string;
  table!: string;
  columns!: {
    column: string, 
    property: string
  }[]
}

@model("ccca", "account")
export class AccountModel extends Model {
  @column("account_id")
  accountId!: string;
  @column("name")
  name!: string;
  @column("email")
  email!: string;
  @column("cpf")
  cpf!: string;

  constructor(accountId: string, name: string, email: string, cpf: string) {
    super();
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
  }
}

export function model (schema: string, table: string) {
  return function (target: any) {
    target.prototype.schema = schema;
    target.prototype.table = table;
  }
}

export function column (column: string) {
  return function (target: any, propertyKey: string) {
    target.columns = target.columns || [];
    target.columns.push({ column, propertyKey })
  }
}
import { Name } from './vo/Name';
import { Email } from './vo/Email';
import { Cpf } from './vo/Cpf';
import { CarPlate } from './vo/CarPlate';
import { Password } from './vo/Password';
import { UUID } from './vo/UUID';

// Entity
export class Account {
  private accountId: UUID;
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate?: CarPlate;
  private password: Password;

  constructor(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    carPlate: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean
  ) {
    this.accountId = new UUID(accountId)
    this.name = new Name(name);
		this.email = new Email(email)
		this.cpf = new Cpf(cpf);
		if (isDriver) this.carPlate = new CarPlate(carPlate);
		this.password = new Password(password);
  }

  static create (
    name: string,
    email: string,
    cpf: string,
    password: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean
  ) {
    const accountId = UUID.create().getValue();
    return new Account(accountId, name, email, cpf, password, carPlate, isPassenger, isDriver);
  }

  getName() {
    return this.name.getValue();
  }

  setName(name: string) {
    return this.name = new Name(name);
  }

  getEmail() {
    return this.email.getValue();
  }

  getCpf() {
    return this.cpf.getValue();
  }

  getCarPlate() {
    return this.carPlate?.getValue();
  }

  getPassword() {
    return this.password.getValue();
  }

  getAccountId() {
    return this.accountId.getValue();
  }
}
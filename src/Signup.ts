import { Account } from './Account';
import AccountRepository from "./AccountRepository";
import { inject } from './Registry';

export default class Signup {
	@inject("accountRepository")
	accountRepository!: AccountRepository

	async execute(input: any) {
		const account = Account.create(
			input.name, 
			input.email, 
			input.cpf, 
			input.password, 
			input.carPlate, 
			input.isPassenger,
			input.isDriver
		);
		const existingAccount = await this.accountRepository.getAccountByEmail(account.email);
		if (existingAccount) throw new Error("Account already exists");		
		await this.accountRepository.saveAccount(account);
		return {
			accountId: account.accountId
		}
	}
}

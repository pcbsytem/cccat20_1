import AccountRepository from '../../infra/repository/AccountRepository';
import { Account } from '../domain/Account';

export default class GetAccount {
	constructor(readonly accountRepository: AccountRepository) {

	}

	async execute(accountId: string): Promise<Account> {
		const account = await this.accountRepository.getAccountById(accountId);
		return account;
	}
}
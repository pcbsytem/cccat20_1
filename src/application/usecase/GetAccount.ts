import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
	constructor(readonly accountRepository: AccountRepository) {

	}

	async execute(accountId: string) {
		const account = await this.accountRepository.getAccountById(accountId);
		return account;
	}
}
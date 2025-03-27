import AccountRepository from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';
import { inject } from '../../infra/di/Registry';

export default class AcceptRide {
  @inject("accountRepository")
  accountRepository!: AccountRepository;
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<void> {
    const account = await this.accountRepository.getAccountById(input.driverId);
    if (!account || !account.isDriver) throw new Error("The account must be from a driver");
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.accept(input.driverId);
    await this.rideRepository.updateRide(ride);
  }
}

type Input = {
  rideId: string,
  driverId: string
}
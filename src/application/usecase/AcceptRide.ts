import AccountRepository from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';
import { inject } from '../../infra/di/Registry';
import Ride from '../domain/Ride';

export default class AcceptRide {
  @inject("accountRepository")
  accountRepository!: AccountRepository;
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountById(input.driverId);
    if (!account || !account.isDriver) throw new Error("The request must be a driver");
    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(input.driverId);
    if (hasActiveRide) throw new Error("The request already have an active ride");
    const outputRide = await this.rideRepository.getRideById(input.rideId);
    const status = "accepted";
    const ride = Ride.update(
      input.rideId,
      outputRide.getPassengerId(),
      input.driverId,
      outputRide.getFrom().getLat(),
      outputRide.getFrom().getLong(),
      outputRide.getTo().getLat(),
      outputRide.getTo().getLong(),
      outputRide.fare,
      outputRide.distance,
      status,
      outputRide.date
    );
    await this.rideRepository.updateRide(ride);
    return {
      rideId: input.rideId
    }
  }
}

type Input = {
  rideId: string,
  driverId: string
}

type Output = {
  rideId: string
}
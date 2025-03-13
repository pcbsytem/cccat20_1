import AccountRepository from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';
import { inject } from '../../infra/di/Registry';
import Ride from '../domain/Ride';

export default class AcceptRide {
  @inject("accountRepository")
  accountRepository!: AccountRepository;
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: any): Promise<any> {
    const account = await this.accountRepository.getAccountById(input.driverId);
    if (!account || !account.isDriver) throw new Error("The request must be a driver");
    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(input.driverId);
    if (hasActiveRide) throw new Error("The request already have an active ride");
    const outputRide = await this.rideRepository.getRideById(input.rideId);
    const status = "accepted";
    const ride = Ride.update(
      input.rideId,
      outputRide.passengerId,
      input.driverId,
      outputRide.fromLat,
      outputRide.fromLong,
      outputRide.toLat,
      outputRide.toLong,
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
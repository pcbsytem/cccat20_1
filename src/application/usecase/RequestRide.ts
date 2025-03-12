import RideRepository from "../../infra/repository/RideRepository";
import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from '../../infra/di/Registry';
import Ride from '../../application/domain/Ride';

export default class RequestRide {
  @inject("accountRepository")
  accountRepository!: AccountRepository;
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountById(input.passengerId);
    if (!account || !account.isPassenger) throw new Error("The request must be a passenger");
    const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
    if (hasActiveRide) throw new Error("The request already have an active ride");
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );
    await this.rideRepository.saveRide(ride);
    return {
      rideId: ride.rideId
    }
  }
}

type Input = {
  passengerId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
}

type Output = {
  rideId: string
}
import RideRepository from '../../infra/repository/RideRepository';
import { inject } from '../../infra/di/Registry';
import Ride from '../domain/Ride';


export default class StartRide {
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<Output> {
    const hasInProgressRide = await this.rideRepository.hasInProgressRideByDriverId(input.driverId);
    if (hasInProgressRide) throw new Error("The request already have an active ride");
    const outputRide = await this.rideRepository.getRideById(input.rideId);
    const status = "in_progress";
    const ride = Ride.update(
      input.rideId,
      outputRide.getRideId(),
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
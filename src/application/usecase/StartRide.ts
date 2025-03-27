import RideRepository from '../../infra/repository/RideRepository';
import { inject } from '../../infra/di/Registry';


export default class StartRide {
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.start();
    await this.rideRepository.updateRideStatus(ride);
  }
}

type Input = {
  rideId: string
}
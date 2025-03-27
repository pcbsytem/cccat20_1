import RideRepository from '../../infra/repository/RideRepository';
import { inject } from '../../infra/di/Registry';
import Ride from '../domain/Ride';


export default class UpdatePosition {
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.updatePosition(input.lat, input.long);
    await this.rideRepository.updateRide(ride);
  }
}

type Input = {
  rideId: string,
  lat: number,
  long: number
}
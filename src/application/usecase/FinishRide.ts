import { inject } from '../../infra/di/Registry';
import RideRepository from '../../infra/repository/RideRepository';
import PositionRepository from '../../infra/repository/PositionRepository';
import Position from '../../domain/entity/Position';
import DistanceCalculator from '../../domain/service/DistanceCalculator';
import FareCalculator from '../../domain/service/FareCalculator';

export default class FinishRide {
  @inject('positionRepository')
  positionRepository!: PositionRepository;
  @inject('rideRepository')
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.finish();
    await this.rideRepository.updateRide(ride);
  }
}

type Input = {
  rideId: string;
};

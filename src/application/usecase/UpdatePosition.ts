import { inject } from '../../infra/di/Registry';
import RideRepository from '../../infra/repository/RideRepository';
import PositionRepository from '../../infra/repository/PositionRepository';
import Position from '../../domain/entity/Position';
import DistanceCalculator from '../../domain/service/DistanceCalculator';
import { FareCalculatorFactory } from '../../domain/service/FareCalculator';

export default class UpdatePosition {
  @inject('positionRepository')
  positionRepository!: PositionRepository;
  @inject('rideRepository')
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<void> {
    const lastPosition = await this.positionRepository.getLastPositionByRideId(
      input.rideId
    );
    const actualPosition = Position.create(
      input.rideId,
      input.lat,
      input.long,
      input.date
    );
    await this.positionRepository.savePosition(actualPosition);
    const ride = await this.rideRepository.getRideById(input.rideId);

    if (lastPosition) {
      const distance = DistanceCalculator.calculateFromPositions([
        lastPosition,
        actualPosition
      ]);
      const fare = FareCalculatorFactory.create(actualPosition.date).calculate(
        distance
      );
      ride.setDistance(ride.getDistance() + distance);
      ride.setFare(ride.getFare() + fare);
      await this.rideRepository.updateRide(ride);
    }
  }
}

type Input = {
  rideId: string;
  lat: number;
  long: number;
  date?: Date;
};

import RideRepository from '../../infra/repository/RideRepository';
import { inject } from '../../infra/di/Registry';
import Position from '../domain/Position';
import PositionRepository from '../../infra/repository/PositionRepository';

export default class UpdatePosition {
  @inject("rideRepository")
  rideRepository!: RideRepository;
  @inject("positionRepository")
  positionRepository!: PositionRepository;

  async execute(input: Input): Promise<Output> {
    const hasInProgressRide = await this.rideRepository.hasActiveRideByRideId(input.rideId);
    if (hasInProgressRide) throw new Error("The request already have an active ride");
    const position = Position.create(
      input.rideId,
      input.latitude,
      input.longitude
    )
    this.positionRepository.savePosition(position);
    return {
      positionId: position.positionId
    }
  }
}

type Input = {
  rideId: string,
  latitude: number,
  longitude: number
}

type Output = {
  positionId: string
}
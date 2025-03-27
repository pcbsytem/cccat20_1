import { inject } from '../../infra/di/Registry';
import RideRepository from '../../infra/repository/RideRepository';
import Position from '../domain/Position';
import PositionRepository from '../../infra/repository/PositionRepository';


export default class UpdatePosition {
  @inject("positionRepository")
  positionRepository!: PositionRepository;
  @inject("rideRepository")
  rideRepository!: RideRepository;

  async execute(input: Input): Promise<void> {
    const position = Position.create(input.rideId, input.lat, input.long);
    this.positionRepository.savePosition(position);
  }
}

type Input = {
  rideId: string,
  lat: number,
  long: number
}
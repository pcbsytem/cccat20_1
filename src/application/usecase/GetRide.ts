import { inject } from '../../infra/di/Registry';
import RideRepository from '../../infra/repository/RideRepository';
import PositionRepository from '../../infra/repository/PositionRepository';
import Position from '../../domain/entity/Position';

export default class GetRide {
  @inject('positionRepository')
  positionRepository!: PositionRepository;
  @inject('rideRepository')
  rideRepository!: RideRepository;

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId);
    const positions = await this.positionRepository.getPositionsByRideId(
      rideId
    );
    return {
      rideId: ride.getRideId(),
      passengerId: ride.getPassengerId(),
      driverId: ride.getDriverId(),
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      fare: ride.getFare(),
      distance: ride.getDistance(),
      status: ride.getStatus(),
      date: ride.date,
      positions: positions.map((position: Position) => ({
        lat: position.getCoord().getLat(),
        long: position.getCoord().getLong()
      }))
    };
  }
}

type Output = {
  rideId: string;
  passengerId: string;
  driverId?: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  fare: number;
  distance: number;
  status: string;
  date: Date;
  positions: { lat: number; long: number }[];
};

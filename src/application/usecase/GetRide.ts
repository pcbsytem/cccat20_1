import { inject } from '../../infra/di/Registry';
import RideRepository from '../../infra/repository/RideRepository';
import PositionRepository from '../../infra/repository/PositionRepository';

export default class GetRide {
  @inject("positionRepository")
  positionRepository!: PositionRepository;
  @inject("rideRepository")  
  rideRepository!: RideRepository;

  async execute(rideId: string): Promise<Output> {
    const rideData = await this.rideRepository.getRideById(rideId);
    const positions = await this.positionRepository.getPositionsByRideId(rideId);
    const distance = rideData.calculateDistance(positions);
    const fare = rideData.calculateFare(positions);
    return {
      rideId: rideData.getRideId(),
      passengerId: rideData.getPassengerId(),
      driverId: rideData.getDriverId(),
      fromLat: rideData.getFrom().getLat(),
      fromLong: rideData.getFrom().getLong(),
      toLat: rideData.getTo().getLat(),
      toLong: rideData.getTo().getLong(),
      fare,
      distance,
      status: rideData.getStatus(),
      date: rideData.date
    };
  }
}

type Output = {
  rideId: string,
  passengerId: string,
  driverId?: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
  fare: number,
  distance: number,
  status: string,
  date: Date
}
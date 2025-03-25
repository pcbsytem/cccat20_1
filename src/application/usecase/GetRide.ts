import { inject } from '../../infra/di/Registry';
import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
  @inject("rideRepository")  
  rideRepository!: RideRepository;

  async execute(rideId: string): Promise<Output> {
    const rideData = await this.rideRepository.getRideById(rideId);
    return {
      rideId: rideData.getRideId(),
      passengerId: rideData.getPassengerId(),
      fromLat: rideData.getFrom().getLat(),
      fromLong: rideData.getFrom().getLong(),
      toLat: rideData.getTo().getLat(),
      toLong: rideData.getTo().getLong(),
      fare: rideData.calculateFare(),
      distance: rideData.calculateDistance(),
      status: rideData.status,
      date: rideData.date
    };
  }
}

type Output = {
  rideId: string,
  passengerId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
  fare: number,
  distance: number,
  status: string,
  date: Date
}
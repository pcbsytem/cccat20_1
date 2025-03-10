import { inject } from './Registry';
import RideDAO from './RideDAO';


export default class GetRide {
  @inject("rideDAO")  
  rideDAO!: RideDAO;

  calculateDistance (fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180;
    const deltaLat = (toLat - fromLat) * degreesToRadians;
    const deltaLong = (toLong - fromLong) * degreesToRadians;
    const a = 
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(fromLat * degreesToRadians) * 
      Math.cos(toLat * degreesToRadians) *
      Math.sin(deltaLong / 2) *
      Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return Math.round(distance);
  }

  async execute(rideId: string): Promise<Output> {
    const rideData = await this.rideDAO.getRideById(rideId);
    const output = {
      rideId: rideData.ride_id,
      passengerId: rideData.passenger_id,
      fromLat: parseFloat(rideData.from_lat),
      fromLong: parseFloat(rideData.from_long),
      toLat: parseFloat(rideData.to_lat),
      toLong: parseFloat(rideData.to_long),
      fare: parseFloat(rideData.fare),
      distance: parseFloat(rideData.distance),
      status: rideData.status,
      date: rideData.date
    };
    output.distance = this.calculateDistance(output.fromLat, output.fromLong, output.toLat, output.toLong);
    output.fare = output.distance * 2.1;
    return output;
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
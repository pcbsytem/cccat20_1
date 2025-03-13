import Ride from '../../application/domain/Ride';
import { inject } from '../di/Registry';
import DatabaseConnection from '../database/DatabaseConnection';

// Interface Adapter
export default interface RideRepository {
  saveRide(ride: Ride): Promise<void>;
  updateRide(ride: Ride): Promise<void>;
  getRideById(rideId: string): Promise<Ride>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
  hasActiveRideByDriverId(driverId: string): Promise<boolean>;
  hasInProgressRideByDriverId(driverId: string): Promise<boolean>;
}

export class RideRepositoryDatabase implements RideRepository {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async saveRide(ride: Ride): Promise<void> {
    await this.connection.query(
      "insert into ccca.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]
    );
  }

  async updateRide(ride: Ride): Promise<void> {
    await this.connection.query(
      "update ccca.ride set passenger_id = $1, driver_id = $2, status = $3, fare = $4, distance = $5, from_lat = $6, from_long = $7, to_lat = $8, to_long = $9, date = $10 where ride_id = $11",
      [ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date, ride.rideId]
    );
  }

  async getRideById(rideId: string): Promise<Ride> {
    const [data] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
    return new Ride(
      data.ride_id, 
      data.passenger_id, 
      data.driver_id, 
      parseFloat(data.from_lat), 
      parseFloat(data.from_long),
      parseFloat(data.to_lat),
      parseFloat(data.to_long),
      parseFloat(data.fare),
      parseFloat(data.distance),
      data.status,
      data.date
    );
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const [data] = await this.connection.query("select 1 from ccca.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
    return !!data;
  }

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    const [data] = await this.connection.query("select 1 from ccca.ride where driver_id = $1 and status in ('accepted', 'in_progress')", [driverId]);
    return !!data;
  }

  async hasInProgressRideByDriverId(driverId: string): Promise<boolean> {
    const [data] = await this.connection.query("select 1 from ccca.ride where driver_id = $1 and status in ('in_progress')", [driverId]);
    return !!data;
  }  
}
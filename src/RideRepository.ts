import pgp from "pg-promise";
import Ride from './Ride';

export default interface RideRepository {
  saveRide(ride: Ride): Promise<void>;
  getRideById(rideId: string): Promise<Ride>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
}

export class RideRepositoryDatabase implements RideRepository {
  async saveRide(ride: Ride): Promise<void> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query(
      "insert into ccca.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]
    );
    await connection.$pool.end();
  }

  async getRideById(rideId: string): Promise<Ride> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [data] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
    await connection.$pool.end();
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
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [data] = await connection.query("select 1 from ccca.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
    await connection.$pool.end();
    return !!data;
  }  
}
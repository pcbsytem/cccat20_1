import pgp from "pg-promise";

export default interface RideDAO {
  getRideById(rideId: string): Promise<any>;
  getRideByPassengerIdAndStatus(passengerId: string, status: string): Promise<any>;
  saveRide(ride: any): Promise<void>;
}

export class RideDAODatabase implements RideDAO {
  async getRideById(rideId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [output] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
    await connection.$pool.end();
    return output;
  }

  async getRideByPassengerIdAndStatus(passengerId: string, status: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [output] = await connection.query("select * from ccca.ride where passenger_id = $1 and status <> $2", [passengerId, status]);
    await connection.$pool.end();
    return output;
  }

  async saveRide(ride: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query(
      "insert into ccca.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]
    );
    await connection.$pool.end();
  }
}
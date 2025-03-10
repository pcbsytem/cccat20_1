import RideDAO from './rideDAO';


export default class GetRide {
  constructor(readonly rideDAO: RideDAO) {

  }

  async execute(rideId: string) {
    const output = await this.rideDAO.getRideById(rideId);
    const ride = {
      rideId: output.ride_id,
      passenger: {
        passengerId: output.passenger_id,
        name: null,
        email: null,
        phone: null
      },
      driver: {
        driverId: output.driver_id,
        name: null,
        email: null,
        phone: null
      },
      status: output.status,
      fare: output.fare,
      distance: output.distance,
      fromLat: output.from_lat,
      fromLong: output.from_long,
      toLat: output.to_lat,
      toLong: output.to_long,
      date: output.date
    }
    return ride;
  }
}
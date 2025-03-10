import crypto from "crypto";
import RideDAO from "./rideDAO";
import AccountDAO from "./data";

export default class RequestRide {
  constructor(readonly rideDAO: RideDAO, readonly accountDAO: AccountDAO) {

  }

  async execute(input: any) {
    const ride = {
      rideId: crypto.randomUUID(),
      passengerId: input.passengerId,
      driverId: input.driverId,
      status: "requested",
      fare: input.fare,
      distance: input.distance,
      fromLat: input.fromLat,
      fromLong: input.fromLong,
      toLat: input.toLat,
      toLong: input.toLong,
      date: new Date().toISOString()
    }
    const existingPassenger = await this.accountDAO.getAccountById(ride.passengerId);
    if (!existingPassenger) throw new Error("Passenger not found");
    if (!existingPassenger.is_passenger) throw new Error("Passenger id didn't match with passenger type");

    const existingRide = await this.rideDAO.getRideByPassengerIdAndStatus(ride.passengerId, ride.status);
    if (existingRide) throw new Error("There is a ride already in progress");
    await this.rideDAO.saveRide(ride);
    return {
      rideId: ride.rideId
    }
  }
}

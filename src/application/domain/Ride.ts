import { Coord } from './vo/Coord';
import { UUID } from './vo/UUID';

// Entity
export default class Ride {
  private rideId: UUID;
  private passengerId: UUID;
  private driverId?: UUID;
  private from: Coord;
  private to: Coord;

  constructor(
    rideId: string,
    passengerId: string,
    driverId: string | null,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly fare: number,
    readonly distance: number,
    readonly status: string,
    readonly date: Date
  ) {
    this.rideId = new UUID(rideId);
    this.passengerId = new UUID(passengerId);
    if (driverId) this.driverId = new UUID(driverId);
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  static create (
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ) {
    const rideId = UUID.create().getValue();
    const status = "requested";
    const date = new Date();
    const fare = 0;
    const distance = 0;
    return new Ride(
      rideId, 
      passengerId,
      null,
      fromLat, 
      fromLong, 
      toLat, 
      toLong, 
      fare, 
      distance, 
      status, 
      date
    );
  }

  static update (
    rideId: string,
    passengerId: string,
    driverId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    fare: number,
    distance: number,
    status: string,
    date: Date
  ) {    
    return new Ride(
      rideId, 
      passengerId,
      driverId,
      fromLat, 
      fromLong, 
      toLat, 
      toLong, 
      fare, 
      distance, 
      status, 
      date
    );
  }

  calculateDistance () {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180;
    const deltaLat = (this.to.getLat() - this.from.getLat()) * degreesToRadians;
    const deltaLong = (this.to.getLong() - this.from.getLong()) * degreesToRadians;
    const a = 
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(this.from.getLat() * degreesToRadians) * 
      Math.cos(this.to.getLat() * degreesToRadians) *
      Math.sin(deltaLong / 2) *
      Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return Math.round(distance);
  }

  calculateFare () {
    const distance = this.calculateDistance();
    return distance * 2.1;
  }

  getFrom () {
    return this.from;
  }

  getTo () {
    return this.to;
  }

  getRideId () {
    return this.rideId.getValue();
  }

  getPassengerId () {
    return this.passengerId.getValue();
  }

  getDriverId () {
    return this.driverId?.getValue();
  }
}
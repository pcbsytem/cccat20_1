import Position from './Position';
import { Coord } from './vo/Coord';
import { UUID } from './vo/UUID';

// Entity
export default class Ride {
  private rideId: UUID;
  private passengerId: UUID;
  private driverId?: UUID;
  private from: Coord;
  private to: Coord;
  private positions: Position[];

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
    public status: string,
    readonly date: Date
  ) {
    this.rideId = new UUID(rideId);
    this.passengerId = new UUID(passengerId);
    if (driverId) this.driverId = new UUID(driverId);
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
    this.positions = [];
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
    if (["requested", "accepted"].includes(this.status)) {
      return this.calculateDistanceCoord(this.from, this.to);
    }
    let total = 0;
    for (const [index, position] of this.positions.entries()) {
      const nextPosition = this.positions[index + 1];
      if (!nextPosition) break;
      total += this.calculateDistanceCoord(position.getCoord(), nextPosition.getCoord())
    }
    return total;
  }  
  
  calculateDistanceCoord (from: Coord, to: Coord) {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180;
    const deltaLat = (to.getLat() - from.getLat()) * degreesToRadians;
    const deltaLong = (to.getLong() - from.getLong()) * degreesToRadians;
    const a = 
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(from.getLat() * degreesToRadians) * 
      Math.cos(to.getLat() * degreesToRadians) *
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

  setDriverId (driverId: string) {
    this.driverId = new UUID(driverId);
  }

  setStatus (status: string) {    
    this.status = status;
  }

  getStatus () {
    return this.status;
  }

  accept (driverId: string) {
    if (this.status !== "requested") throw new Error("Invalid status");
    this.status = "accepted";
    this.setDriverId(driverId);
  }

  start () {
    if (this.status !== "accepted") throw new Error("Invalid status");
    this.status = "in_progress";
  }

  updatePosition (lat: number, long: number) {
    this.positions.push(Position.create(this.getRideId(), lat, long));
  }

  getPositions () {
    return this.positions;
  }

  setPositions (positions: Position[]) {
    this.positions = positions;
  }
}
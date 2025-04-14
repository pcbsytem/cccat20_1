import Coord from '../vo/Coord';
import RideStatus, { RideStatusFactory } from '../vo/RideStatus';
import UUID from '../vo/UUID';

export default class Ride {
  private rideId: UUID;
  private passengerId: UUID;
  private driverId?: UUID;
  private from: Coord;
  private to: Coord;
  private status: RideStatus;

  constructor(
    rideId: string,
    passengerId: string,
    driverId: string | null,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    private fare: number,
    private distance: number,
    status: string,
    readonly date: Date
  ) {
    this.rideId = new UUID(rideId);
    this.passengerId = new UUID(passengerId);
    if (driverId) this.driverId = new UUID(driverId);
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
    this.status = RideStatusFactory.create(status, this);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ) {
    const rideId = UUID.create().getValue();
    const status = 'requested';
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

  static update(
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

  getFrom() {
    return this.from;
  }

  getTo() {
    return this.to;
  }

  getRideId() {
    return this.rideId.getValue();
  }

  getPassengerId() {
    return this.passengerId.getValue();
  }

  getDriverId() {
    return this.driverId?.getValue();
  }

  setDriverId(driverId: string) {
    this.driverId = new UUID(driverId);
  }

  setStatus(status: RideStatus) {
    this.status = status;
  }

  getStatus() {
    return this.status.value;
  }

  accept(driverId: string) {
    this.status.accept();
    this.setDriverId(driverId);
  }

  start() {
    this.status.start();
  }

  finish() {
    this.status.finish();
  }

  getFare() {
    return this.fare;
  }

  setFare(fare: number) {
    this.fare = fare;
  }

  getDistance() {
    return this.distance;
  }

  setDistance(distance: number) {
    return (this.distance = distance);
  }
}

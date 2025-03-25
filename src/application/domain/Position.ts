import { UUID } from './vo/UUID';

export default class Position {
  constructor(
    readonly positionId: string,
    readonly rideId: string,
    readonly latitude: number,
    readonly longitude: number,
    readonly date: Date
  ) {
    if (latitude < -90 || latitude > 90) throw new Error("The latitude is invalid");
    if (longitude < -180 || longitude > 180) throw new Error("The longitude is invalid");
  }

  static create (
    rideId: string,
    latitude: number,
    longitude: number
  ) {
    const positionId = UUID.create().getValue();
    const date = new Date();
    return new Position(
      positionId, 
      rideId,
      latitude, 
      longitude,
      date
    );
  }
}
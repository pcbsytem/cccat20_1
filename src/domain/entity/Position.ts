import Coord from '../vo/Coord';
import UUID from '../vo/UUID';

export default class Position {
  private positionId: UUID;
  private rideId: UUID;
  private coord: Coord;

  constructor(
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    readonly date: Date
  ) {
    this.positionId = new UUID(positionId);
    this.rideId = new UUID(rideId);
    this.coord = new Coord(lat, long);
  }

  static create(rideId: string, lat: number, long: number, date = new Date()) {
    const positionId = UUID.create().getValue();
    return new Position(positionId, rideId, lat, long, date);
  }

  getPositionId() {
    return this.positionId.getValue();
  }

  getRideId() {
    return this.rideId.getValue();
  }

  getCoord() {
    return this.coord;
  }
}

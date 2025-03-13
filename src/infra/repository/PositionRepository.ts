import Position from '../../application/domain/Position';
import DatabaseConnection from '../database/DatabaseConnection';
import { inject } from '../di/Registry';


export default interface PositionRepository {
  savePosition: (position: Position) => Promise<void>;
}

export class PositionRepositoryDatabase implements PositionRepository {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async savePosition(position: Position): Promise<void> {
    await this.connection.query(
      "insert into ccca.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [position.positionId, position.rideId, position.latitude, position.longitude, position.date]
    );
  }
}
import { RowDataPacket } from 'mysql2';

export interface UserInterface extends RowDataPacket {
  id: number;
  uuid: string;
  username: string;
  password_hash: string;
  firts_name: string;
  last_name: string;
  dt_created: string;
  status: number;
}

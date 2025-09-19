import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { UserInterface } from './interface/users.interface';

@Injectable()
export class AuthModel {
  constructor(@Inject('MYSQL_CONNECTION') private readonly db: Pool) {}

  async findAllUsers() {
    const query: string = `select * from user;`;
    const [rows] = await this.db.execute(query);
    return rows || null;
  }

  async createNewUser(user: {
    firts_name: string;
    last_name: string;
    username: string;
    uuid: string;
  }) {
    const query: string = `insert into user (username, dt_created, first_name, last_name, uuid)
                                    values (?, NOW(), ?, ?, ?);`;
    const [rows] = await this.db.execute<ResultSetHeader>(query, [
      user.username,
      user.firts_name,
      user.last_name,
      user.uuid,
    ]);
    return rows.insertId ?? null;
  }

  async searchOneUser(id: number) {
    const query: string = `select * from user where id = ?`;
    const [rows] = await this.db.execute<(UserInterface & RowDataPacket)[]>(
      query,
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException('User not found');
    }
    return rows[0] as UserInterface;
  }

  async editAUser(
    id: number,
    user: { firts_name: string; last_name: string; username: string },
  ) {
    const query: string = `update user 
                                    set username = ?, first_name = ?, last_name = ?
                                    where id_user = ?;`;
    const [rows] = await this.db.execute(query, [
      user.username,
      user.firts_name,
      user.last_name,
      id,
    ]);
    return rows ?? null;
  }

  async deleteAUser(id: number) {
    const query: string = `update user
                                    set status = 0
                                    where id_user = ?;`;
    const [rows] = await this.db.execute<ResultSetHeader>(query, [id]);

    return rows.changedRows > 0;
  }

  async activateAUser(id: number) {
    const query: string = `update user
                                    set status = 1
                                    where id_user = ?;`;
    const [rows] = await this.db.execute<ResultSetHeader>(query, [id]);
    if (rows.changedRows === 0) {
      return false;
    }
    return rows.changedRows ?? null;
  }

  async statusOfUser(id: number): Promise<number> {
    const query: string = `select username, cast(status as unsigned) as status from user
                                    where id = 1;`;
    const [rows] = await this.db.execute<(UserInterface & RowDataPacket)[]>(
      query,
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException('User not found!');
    }

    return rows[0]?.status;
  }
}

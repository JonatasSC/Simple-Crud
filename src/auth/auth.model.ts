import { Inject, Injectable } from "@nestjs/common";
import { Pool, ResultSetHeader } from "mysql2/promise";

@Injectable()
export class AuthModel {
    constructor(@Inject('MYSQL_CONNECTION') private readonly db: Pool) { }

    async findAllUsers() {
        try {
            const query: string = `select * from user;`

            const [rows] = await this.db.execute(query)
            return rows || null

        } catch (error) {
            console.log("We have a error", error)
            return false
        }
    }

    async createNewUser(user: { firts_name: string; last_name: string; username: string; uuid: string }) {
        try {
            const query: string = `insert into user (username, dt_created, first_name, last_name, uuid)
                                    values (?, NOW(), ?, ?, ?);`
            const [rows] = await this.db.execute<ResultSetHeader>(query, [user.username, user.firts_name, user.last_name, user.uuid])
            return rows.insertId ?? null

        } catch (error) {
            console.log("We have a error when try to create a new user", error)
            return false
        }
    }

    async searchOneUser(id: number) {
        try {
            const query: string = `select * from user where id_user = ?`

            const [rows] = await this.db.execute<any>(query, [id])
            return rows[0] ?? null

        } catch (error) {
            console.log("We have a error", error)
            return false
        }
    }

    async editAUser(id: number, user: { firts_name: string; last_name: string; username: string }) {
        try {
            const query: string = `update user 
                                    set username = ?, first_name = ?, last_name = ?
                                    where id_user = ?;`
            const [rows] = await this.db.execute(query, [user.username, user.firts_name, user.last_name, id])
            return rows ?? null

        } catch (error) {
            console.log("We have a error", error)
            return false
        }
    }

    async deleteAUser(id: number) {
        try {
            const query: string = `update user
                                    set status = 0
                                    where id_user = ?;`
            const [rows] = await this.db.execute<ResultSetHeader>(query, [id])
            if (rows.changedRows === 0) {
                return false
            }
            return rows.changedRows ?? null
        } catch (error) {
            console.log("We have a error", error)
            return false
        }
    }

    async activateAUser(id: number) {
        try {
            const query: string = `update user
                                    set status = 1
                                    where id_user = ?;`
            const [rows] = await this.db.execute<ResultSetHeader>(query, [id])
            if (rows.changedRows === 0) {
                return false
            }
            return rows.changedRows ?? null
        } catch (error) {
            console.log("We have a error", error)
            return false
        }
    }

    async statusOfUser(id: number) {
        try {
            const query: string = `select id_user, cast(status as unsigned) as status from user
                                    where id_user = ?;`
            const [rows] = await this.db.execute<any>(query, [id])
            return rows[0].status ?? null
        } catch (error) {
            console.log("We have a error", error)
            return false
        }
    }
}
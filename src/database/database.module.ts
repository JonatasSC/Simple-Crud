import { Global, Module } from "@nestjs/common";
import { MysqlClient } from "./database.service";
import * as mysql from 'mysql2/promise'

//Here i use mysql promise to administrate the conection pool auomaticaly
@Global()
@Module({
    providers: [
        {
            provide: 'MYSQL_CONNECTION',
            useFactory: async () => {
                const pool = mysql.createPool({
                    host: process.env.MYSQL_HOST,
                    user: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASS,
                    database: process.env.MYSQL_SCHEMA,
                    waitForConnections: true,
                    connectTimeout: 1000 * 60,
                    queueLimit: 0,
                    connectionLimit: 10,
                    timezone: '-03:00',
                })
                return pool;
            },
        },
    ],
    exports: ['MYSQL_CONNECTION'],
})

export class DatabaseModule {}

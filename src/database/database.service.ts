import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';

/* 
  This is other form of create a mysql connection.
  administrating the conection close and open pool manuality.
*/

@Injectable()
export class MysqlClient {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_SCHEMA,
      waitForConnections: true,
      connectTimeout: 1000 * 60,
      queueLimit: 0,
      multipleStatements: true,
      timezone: '-03:00',
      enableKeepAlive: true,
    });
  }

  public async executeSql(
    connection: mysql.PoolConnection,
    query: string,
    params?: Array<any>,
  ): Promise<{ results: any; fields: mysql.FieldPacket[] }> {
    try {
      return await new Promise((resolve, reject) => {
        connection.query(query, params, (error, results, fields) => {
          if (error) {
            reject(error);
          }
          resolve({ results, fields: fields ?? [] });
        });
      });
    } catch (error) {
      console.error('Erro ao executar a query', error);
      throw error;
    }
  }

  public async runConnection(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        resolve(connection);
      });
    });
  }

  public async closeConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  public async beginTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        connection.beginTransaction((error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
      });
    });
  }

  public async commitTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        connection.commit((error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
      });
    });
  }

  public async releaseConnection(
    connection: mysql.PoolConnection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.release();
      resolve();
    });
  }
}

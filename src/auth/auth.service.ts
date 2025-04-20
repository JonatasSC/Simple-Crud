import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthModel } from './auth.model';

@Injectable()
export class AuthService {
  constructor(private readonly AuthModel: AuthModel) {}

  async createNewUser(createAuthDto: CreateAuthDto) {
      return this.AuthModel.createNewUser(createAuthDto) ;
  }

  async findAll() {
    return this.AuthModel.findAllUsers()
  } 

  findOne(id: number) {
    return this.AuthModel.searchOneUser(id);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return this.AuthModel.editAUser(id, updateAuthDto);
  }

  async remove(id: number) {
    const status: number = await this.AuthModel.statusOfUser(id)
    if (status === 0) {
      return 'The user already deactivated'
    }
    
    return await this.AuthModel.deleteAUser(id);
  }

  async active(id: number) {
      const status: number = await this.AuthModel.statusOfUser(id)
      if (status === 1) {
        return 'The user already active'
      }
      
    return await this.AuthModel.activateAUser(id)
  }
  
 /*  constructor(private readonly MysqlClient: MysqlClient) { }

  async createNewUser(createAuthDto: CreateAuthDto) {
    const query = `INSERT INTO User (username, dt_created, first_name, last_name, uuid)
                   VALUES (?, NOW(), ?, ?, ?);`
    const connection = await this.MysqlClient.runConnection()

    try {
      const { username, sobrenome, nome, uuid } = createAuthDto

      const { results } = await this.MysqlClient.executeSql(connection, query, [
        nome, sobrenome, username, uuid
      ])

      return { id_user: results.insertId };

    } catch (error) {
      console.log(error)
    } finally {
      await this.MysqlClient.releaseConnection(connection)
    }
  }

  async findAll() {
    const query = `SELECT * FROM User;`
    const connection = await this.MysqlClient.runConnection()

    try {
      const { results } = await this.MysqlClient.executeSql(connection, query, [])
      return results;
    } catch (error) {
      console.log(error)
    } finally {
      await this.MysqlClient.releaseConnection(connection)
    }
    
  } 

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    console.log(updateAuthDto)
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  } */
}

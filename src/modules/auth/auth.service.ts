import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthModel } from './auth.repository';
import { transactionService } from 'src/middleware/transaction/transaction.service';
import { CustomException } from 'src/commun/exceptions/custom-exceptions/custom-exception.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';
import { UuidGenUtil } from 'src/utils/uuid-generator.util';
import { AuthenticateDto } from './dto/authenticate.dto';
import { UserInterface } from './interface/users.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly AuthModel: AuthModel,
    private readonly customException: CustomException,
    private readonly transactionId: transactionService,
  ) {}

  async createNewUser(createAuthDto: CreateAuthDto) {
    try {
      const uuid: string = UuidGenUtil.gen();
      const salt: string = genSaltSync(10);
      const password_hash: string = hashSync(createAuthDto.password, salt);

      const confirm: boolean = await this.AuthModel.createNewUser(
        createAuthDto,
        password_hash,
        uuid,
      );
      if (!confirm) {
        throw new BadRequestException('Error when try to create a user');
      }

      return;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Internal Server Error Create User: ${errorMessage}`,
      );
    }
  }

  async authenticateUser(authenticateDto: AuthenticateDto) {
    try {
      const findUser: UserInterface =
        await this.AuthModel.searchOneUserByUsername(authenticateDto.username);

      const checkPasswd: boolean = compareSync(
        authenticateDto.password,
        findUser.password_hash,
      );

      if (!checkPasswd) {
        throw new ForbiddenException('Invalid Password');
      }

      const privateKey = process.env.PRIVATE_KEY_JWT;

      if (!privateKey) {
        throw new InternalServerErrorException('JWT private key is not configured');
      }

      const token: string = jwt.sign(
        {
          nome: findUser.firts_name,
          last_name: findUser.last_name,
          username: findUser.username,
          uuid: findUser.uuid,
          id: findUser.id,
          password_hash: findUser.dt_created,
          status: findUser.status,
        },
        privateKey,
        {
          algorithm: 'HS256',
          expiresIn: '2h',
        },
      );

      return token;
      
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Internal Server Error Create User: ${errorMessage}`,
      );
    }
  }

  async findAll() {
    return this.AuthModel.findAllUsers();
  }

  findOne(id: number) {
    return this.AuthModel.searchOneUser(id);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return this.AuthModel.editAUser(id, updateAuthDto);
  }

  async remove(id: number) {
    const status: number = await this.AuthModel.statusOfUser(id);

    if (status === 0) {
      throw new BadRequestException('User already deactivated');
    }

    const dellUser: boolean = await this.AuthModel.deleteAUser(id);
    if (!dellUser)
      throw new InternalServerErrorException(
        'Error when try to deactivated this user',
      );

    return;
  }

  async active(id: number) {
    const status: number = await this.AuthModel.statusOfUser(id);

    if (status === 1) {
      throw new BadRequestException('User already active');
    }

    const activeUser: any = await this.AuthModel.activateAUser(id);
    if (!activeUser)
      throw new InternalServerErrorException(
        'Error when try to active this user',
      );

    return;
  }
}

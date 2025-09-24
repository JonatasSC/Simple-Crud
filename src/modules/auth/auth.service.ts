import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthModel } from './auth.repository';
import { transactionService } from 'src/middleware/transaction/transaction.service';
import { CustomException } from 'src/commun/exceptions/custom-exceptions/custom-exception.service';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { UuidGenUtil } from 'src/utils/uuid-generator.util';

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
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
    console.log(dellUser);
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

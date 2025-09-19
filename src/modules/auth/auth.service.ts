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

@Injectable()
export class AuthService {
  constructor(
    private readonly AuthModel: AuthModel,
    private readonly customException: CustomException,
    private readonly transactionId: transactionService,
  ) {}

  async createNewUser(createAuthDto: CreateAuthDto) {
    return this.AuthModel.createNewUser(createAuthDto);
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

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModel } from './auth.repository';
import { CustomException } from 'src/commun/exceptions/custom-exceptions/custom-exception.service';
import { transactionService } from 'src/middleware/transaction/transaction.service';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    DatabaseModule,
    AuthModel,
    CustomException,
    transactionService,
  ],
})
export class AuthModule {}

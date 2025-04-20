import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModel } from './auth.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, DatabaseModule, AuthModel],
})
export class AuthModule {}

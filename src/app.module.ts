import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { transactionService } from './middleware/transaction/transaction.service';
import { HttpExceptionFilter } from './commun/exceptions/filters/http-execption.filter';
import { CustomException } from './commun/exceptions/custom-exceptions/custom-exception.service';
import { SuccessResponseInterceptor } from './commun/exceptions/interceptors/success/success.interceptor';
import { TransactionMiddleware } from './middleware/transaction/transaction.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule, AuthModule],
    providers: [transactionService, HttpExceptionFilter, CustomException, SuccessResponseInterceptor]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*')
  }
}
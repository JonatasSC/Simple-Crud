import { Request } from 'express';
import { CustomException } from './../../custom-exceptions/custom-exception.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { transactionService } from 'src/middleware/transaction/transaction.service';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly CustomException: CustomException,
    private readonly generateTransaction: transactionService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request & { transactionId?: string }>();
    const transactionId =
      req.transactionId || this.generateTransaction.generateTransactionId();

    return next.handle().pipe(
      map((data) => {
        return this.CustomException.success(transactionId, data);
      }),
    );
  }
}

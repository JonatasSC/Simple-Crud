import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerTransactionId = req.headers['global-transaction-id']
    const transaction_id =
      typeof headerTransactionId === 'string' && headerTransactionId.trim() !== ''
        ? headerTransactionId
        : uuidv4();

    (req as any).transctionId = transaction_id

    next()
  }
}
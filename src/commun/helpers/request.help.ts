import { Request } from 'express';

interface RequestWithTransaction extends Request {
  transactionId: string;
}
export function generateTransactionId(req: RequestWithTransaction): string {
  return req.transactionId || 'unknown-tx';
}

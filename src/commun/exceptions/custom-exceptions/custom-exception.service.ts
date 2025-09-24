import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomException {
  success<T = any>(
    transactionId: string,
    data: T,
    message = 'Success',
    statusCode = 200,
  ) {
    return {
      status: 1,
      message,
      is_success: true,
      transaction_id: transactionId,
      information: data,
      statusCode,
    };
  }

  error(
    transactionId: string,
    message = 'Unexpected Error',
    statusCode = 500,
    data: unknown,
  ) {
    return {
      status: 0,
      message,
      is_success: false,
      transaction_id: transactionId,
      information: data,
      statusCode,
    };
  }
}

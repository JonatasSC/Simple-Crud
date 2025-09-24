import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CustomException } from '../custom-exceptions/custom-exception.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(CustomException)
    private readonly CustomException: CustomException,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { transactionId?: string }>();

    const transaction = request.transactionId || uuidv4();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal Server Error';
    let extraInfo: unknown = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        extraInfo = responseObj.information || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = this.CustomException.error(
      transaction,
      message,
      status,
      extraInfo,
    );

    response.status(status).json(errorResponse);
  }
}

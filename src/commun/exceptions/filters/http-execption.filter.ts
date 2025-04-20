import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CustomException } from "../custom-exceptions/custom-exception.service";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(CustomException)
        private readonly CustomException: CustomException,
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const transaction = (request as any).transactionId || uuidv4()

        const status = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        const message =
            exception?.response?.message ||
            exception?.message ||
            'Internal Server Error'

        const extraInfo =
            exception?.response?.information || null
        
            const errorResponse = this.CustomException.error(
                transaction,
                message,
                status,
                extraInfo,
            )

            response.status(status).json(errorResponse)
    }
}
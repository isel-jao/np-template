import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientValidationError)
export class PrismaClientValidationFilter implements ExceptionFilter {
  public catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // get error message from exception
    const message = exception.message;
    console.log('PrismaClientValidationFilte: ', message);

    return response.status(400).json({
      statusCode: 400,
      error: {
        message,
        code: 'PrismaClientValidationError',
      },
    });
  }
}

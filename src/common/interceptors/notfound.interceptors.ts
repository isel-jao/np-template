import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // check if data is null and response is 200
        if (!data && context.switchToHttp().getResponse().statusCode === 200)
          context.switchToHttp().getResponse().status(404).json({
            statusCode: 404,
            error: 'Not Found',
            message: 'Resource not found',
          });
        return data;
      }),
    );
  }
}

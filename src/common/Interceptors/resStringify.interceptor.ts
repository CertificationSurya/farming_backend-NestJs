import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { SuccessResponse } from 'src/common/filters/Response.dto';
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data: SuccessResponse<T>) => {
            
          if (data instanceof SuccessResponse) {
            return JSON.stringify(data)
          }
          
          return data;
        })
      );
    }
  }
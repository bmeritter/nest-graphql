import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApolloError } from 'apollo-server-core';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(err => {
        const { response } = err;
        return this.handleResponseError(response);
      }),
    );
  }

  private handleResponseError(response) {
    const { status = 0, data } = response;
    return throwError(new ApolloError(data.msg, status, data));
  }
}

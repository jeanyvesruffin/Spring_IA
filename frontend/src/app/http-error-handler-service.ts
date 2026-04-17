import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpErrorHandlerService {
  handle(operation = 'request') {
    return (error: unknown) => {
      let message: string = 'Unknown error';
      if (error instanceof HttpErrorResponse) {
        message = `HTTP ${error.status} - ${error.message}`;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.error(`${operation} failed:`, error);

      return throwError(() => new Error(message));
    };
  }
}

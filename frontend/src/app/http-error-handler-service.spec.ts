import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { HttpErrorHandlerService } from './http-error-handler-service';

describe('HttpErrorHandlerService', () => {
  let service: HttpErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handle() returns a function that wraps HttpErrorResponse', async () => {
    const handler = service.handle('op');
    const fakeError = new HttpErrorResponse({ status: 404, statusText: 'Not found', error: 'Not found' });

    await expect(firstValueFrom(handler(fakeError))).rejects.toThrow('HTTP');
  });
});

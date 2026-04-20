import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AiService } from './ai-service';
import { ConfigService } from './config-service';
import { StorageService } from './storage-service';
import { throwError, firstValueFrom } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler-service';

describe('AiService', () => {
  let service: AiService;
  let httpMock: HttpTestingController;
  const configStub = {
    getApiBaseUrl: () => 'http://api',
    getTimeoutMs: () => 5000,
  } as unknown as ConfigService;
  const storageSpy = { saveRequest: vi.fn() } as unknown as StorageService;
  const errorHandlerStub = {
    handle: (op: string) => (err: any) => throwError(() => err),
  } as unknown as HttpErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: configStub },
        { provide: StorageService, useValue: storageSpy },
        { provide: HttpErrorHandlerService, useValue: errorHandlerStub },
      ],
    });
    service = TestBed.inject(AiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends GET request and stores history on success', async () => {
    const promise = firstValueFrom(service.sendMessage('hello'));

    const req = httpMock.expectOne(
      (r) => r.url === 'http://api/ai' && r.params.get('userInput') === 'hello',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');
    req.flush('AI response');

    const resp = await promise;
    expect(resp).toBe('AI response');
    expect(storageSpy.saveRequest).toHaveBeenCalledWith({
      input: 'hello',
      response: 'AI response',
    });
  });

  it('propagates error through error handler', async () => {
    // reset and provide a custom error handler that returns a throwing observable
    TestBed.resetTestingModule();
    const customHandler = {
      handle: () => (err: any) => throwError(() => new Error('handled')),
    } as unknown as HttpErrorHandlerService;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: configStub },
        { provide: StorageService, useValue: storageSpy },
        { provide: HttpErrorHandlerService, useValue: customHandler },
      ],
    });
    service = TestBed.inject(AiService);
    httpMock = TestBed.inject(HttpTestingController);

    const promise = firstValueFrom(service.sendMessage('x'));

    const req = httpMock.expectOne(
      (r) => r.url === 'http://api/ai' && r.params.get('userInput') === 'x',
    );
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    await expect(promise).rejects.toThrow();
  });
});

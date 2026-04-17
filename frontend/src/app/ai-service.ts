import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config-service';
import { StorageService } from './storage-service';
import { HttpErrorHandlerService } from './http-error-handler-service';
import { catchError, Observable, tap, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private configuration = inject(ConfigService);
  private storage = inject(StorageService);
  private errorHandler = inject(HttpErrorHandlerService);

  // Envoi le message à l'API et gère la réponse
  sendMessage(userInput: string): Observable<string> {
    const baseUrl = this.configuration.getApiBaseUrl();
    const url = `${baseUrl}/ai`;
    const parametres = new HttpParams().set('input', userInput);

    return this.http.get(url, { params: parametres, responseType: 'text' }).pipe(
      timeout(this.configuration.getTimeoutMs()),
      tap({
        next: (resp: string) => {
          this.storage.saveRequest({ input: userInput, response: resp });
        },
      }),
      catchError(this.errorHandler.handle('sendMessage')),
    );
  }
}

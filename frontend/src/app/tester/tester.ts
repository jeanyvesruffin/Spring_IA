import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { timeout } from 'rxjs';
import { ConfigService } from '../config-service';

@Component({
  selector: 'app-tester',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tester.html',
  styleUrls: ['./tester.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tester {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private fb = inject(FormBuilder);

  protected readonly methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

  protected readonly form = this.fb.group({
    method: ['GET' as string, Validators.required],
    url: ['/ai?userInput=Hello', Validators.required],
    body: [''],
  });

  protected readonly inFlight = signal(false);
  protected readonly response = signal<string | null>(null);
  protected readonly statusCode = signal<number | null>(null);
  protected readonly canSend = computed(() => this.form.valid && !this.inFlight());

  send() {
    if (!this.canSend()) return;

    const { method, url, body } = this.form.getRawValue();
    if (!url) return;

    this.inFlight.set(true);
    this.response.set(null);
    this.statusCode.set(null);

    const baseUrl = this.config.apiBaseUrl();
    const fullUrl = url!.startsWith('http') ? url! : `${baseUrl}${url}`;

    let request$;
    switch (method) {
      case 'POST':
        request$ = this.http.post(fullUrl, body ? this.parseBody(body) : null, { responseType: 'text', observe: 'response' });
        break;
      case 'PUT':
        request$ = this.http.put(fullUrl, body ? this.parseBody(body) : null, { responseType: 'text', observe: 'response' });
        break;
      case 'DELETE':
        request$ = this.http.delete(fullUrl, { responseType: 'text', observe: 'response' });
        break;
      default:
        request$ = this.http.get(fullUrl, { responseType: 'text', observe: 'response' });
    }

    request$.pipe(timeout(this.config.timeoutMs())).subscribe({
      next: (resp) => {
        this.statusCode.set(resp.status);
        this.response.set(resp.body ?? '');
        this.inFlight.set(false);
      },
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          this.statusCode.set(err.status);
          this.response.set(err.error ?? err.message);
        } else if (err instanceof Error) {
          this.response.set('Error: ' + err.message);
        } else {
          this.response.set('Unknown error');
        }
        this.inFlight.set(false);
      },
    });
  }

  private parseBody(body: string): unknown {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
}

import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';

export type AppConfigOptions = Partial<{
  apiBaseUrl: string;
  timeoutMs: number;
  maxHistory: number;
}>;

@Injectable({ providedIn: 'root' })
export class ConfigService {
  readonly apiBaseUrl = signal<string>(environment.apiUrl);
  readonly timeoutMs = signal<number>(environment.timeoutMs ?? 10000);
  readonly maxHistory = signal<number>(environment.maxHistory ?? 50);

  constructor() {
    const windows = (window as any).__APP_CONFIG__ as AppConfigOptions | undefined;
    if (windows) this.override(windows);
  }

  override(optionsConfiguration: AppConfigOptions) {
    if (optionsConfiguration.apiBaseUrl) this.apiBaseUrl.set(optionsConfiguration.apiBaseUrl);
    if (typeof optionsConfiguration.timeoutMs === 'number')
      this.timeoutMs.set(optionsConfiguration.timeoutMs);
    if (typeof optionsConfiguration.maxHistory === 'number')
      this.maxHistory.set(optionsConfiguration.maxHistory);
  }

  getApiBaseUrl(): string {
    return this.apiBaseUrl();
  }

  getTimeoutMs(): number {
    return this.timeoutMs();
  }

  getMaxHistory(): number {
    return this.maxHistory();
  }
}

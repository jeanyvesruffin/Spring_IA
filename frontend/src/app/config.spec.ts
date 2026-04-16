import { TestBed } from '@angular/core/testing';

import { Config } from './config';
import { environment } from '../environments/environment';

describe('Config', () => {
  afterEach(() => {
    delete (window as any).__APP_CONFIG__;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(Config);
    expect(service).toBeTruthy();
  });

  it('exposes default environment values', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(Config);

    expect(service.getApiBaseUrl()).toBe(environment.apiUrl);
    expect(service.getTimeoutMs()).toBe(environment.timeoutMs);
    expect(service.getMaxHistory()).toBe(environment.maxHistory);
  });

  it('override() updates configuration values', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(Config);

    service.override({ apiBaseUrl: 'https://api.example', timeoutMs: 1234, maxHistory: 7 });

    expect(service.getApiBaseUrl()).toBe('https://api.example');
    expect(service.getTimeoutMs()).toBe(1234);
    expect(service.getMaxHistory()).toBe(7);
  });

  it('constructor reads window.__APP_CONFIG__ when present', () => {
    (window as any).__APP_CONFIG__ = { apiBaseUrl: 'https://from-window', timeoutMs: 2222, maxHistory: 9 };
    TestBed.configureTestingModule({});
    const service = TestBed.inject(Config);

    expect(service.getApiBaseUrl()).toBe('https://from-window');
    expect(service.getTimeoutMs()).toBe(2222);
    expect(service.getMaxHistory()).toBe(9);
  });
});

import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage-service';
import { ConfigService } from './config-service';

describe('StorageService', () => {
  beforeEach(() => {
    // Ensure a safe localStorage mock exists for the test environment
    if (typeof (globalThis as any).localStorage === 'undefined' || typeof (globalThis as any).localStorage.getItem !== 'function') {
      let store: Record<string, string> = {};
      (globalThis as any).localStorage = {
        getItem(key: string) {
          return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        },
        setItem(key: string, value: string) {
          store[key] = String(value);
        },
        removeItem(key: string) {
          delete store[key];
        },
        clear() {
          store = {};
        },
      };
    } else {
      try {
        (globalThis as any).localStorage.clear?.();
      } catch (_) {}
    }
  });

  afterEach(() => {
    try {
      if ((globalThis as any).localStorage && typeof (globalThis as any).localStorage.removeItem === 'function') {
        (globalThis as any).localStorage.removeItem('chat_history_v1');
      }
    } catch (_) {}
    delete (window as any).__APP_CONFIG__;
    try {
      TestBed.resetTestingModule();
    } catch (_) {}
  });

  it('should be created', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(StorageService);
    expect(service).toBeTruthy();
  });

  it('saveRequest stores a record in localStorage', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(StorageService);

    service.saveRequest({ input: 'hello world' });

    const history = service.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].input).toBe('hello world');
    expect(history[0].id).toBeTruthy();
    expect(history[0].timestamp).toBeTruthy();
  });

  it('clearHistory removes all records', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(StorageService);

    service.saveRequest({ input: 'one' });
    service.saveRequest({ input: 'two' });
    expect(service.getHistory().length).toBeGreaterThanOrEqual(2);

    service.clearHistory();
    expect(service.getHistory().length).toBe(0);
  });

  it('enforces max history from Config (keeps last N entries)', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ConfigService, useValue: { getMaxHistory: () => 1 } as unknown as ConfigService }],
    });
    const service = TestBed.inject(StorageService);

    service.saveRequest({ input: 'first' });
    service.saveRequest({ input: 'second' });

    const history = service.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].input).toBe('second');
  });

  it('returns empty array if stored JSON is invalid', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      localStorage.setItem('chat_history_v1', 'not valid json');
      TestBed.configureTestingModule({});
      const service = TestBed.inject(StorageService);

      const history = service.getHistory();
      expect(Array.isArray(history)).toBeTruthy();
      expect(history.length).toBe(0);
    } finally {
      spy.mockRestore();
    }
  });

  it('getHistory returns stored records', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(StorageService);
    service.saveRequest({ input: 'abc' });
    const history = service.getHistory();
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[history.length - 1].input).toBe('abc');
  });
});

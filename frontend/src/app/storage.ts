import { inject, Injectable } from '@angular/core';
import { Config } from './config';
import { RequestRecord } from './request-record';

const STORAGE_KEY = 'chat_history_v1';

@Injectable({ providedIn: 'root' })
export class Storage {
  private configuration = inject(Config);

  private read(): RequestRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as RequestRecord[]) :[];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  }

  private write(records: RequestRecord[]) {
    try {
      const max = this.configuration.getMaxHistory();
      const toStore = records.slice(-max);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }

  saveRequest(record: Partial<RequestRecord> & { input: string }) {
    const newRecord: RequestRecord = {
      id: record.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      input: record.input,
      response: record.response,
      timestamp: record.timestamp ?? Date.now(),
    };
    const listRecords = this.read();
    listRecords.push(newRecord);
    this.write(listRecords);
  }

  getHistory(): RequestRecord[] {
    return this.read();
  }

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}

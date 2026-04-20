import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RequestRecordInterface } from '../request-record-interface';
import { StorageService } from '../storage-service';

@Component({
  selector: 'app-history',
  imports: [DatePipe, MatListModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class History {
  private storage = inject(StorageService);

  protected readonly history = signal<RequestRecordInterface[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    this.history.set(this.storage.getHistory().reverse());
  }

  clear() {
    this.storage.clearHistory();
    this.history.set([]);
  }
}
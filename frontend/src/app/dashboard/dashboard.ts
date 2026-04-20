import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../storage-service';
import { ConfigService } from '../config-service';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private storage = inject(StorageService);
  private config = inject(ConfigService);
  private router = inject(Router);

  protected readonly historyCount = signal(0);
  protected readonly apiUrl = computed(() => this.config.apiBaseUrl() || '/ai (proxy)');
  protected readonly timeoutMs = computed(() => this.config.timeoutMs());

  constructor() {
    this.historyCount.set(this.storage.getHistory().length);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
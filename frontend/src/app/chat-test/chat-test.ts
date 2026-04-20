import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../ai-service';

@Component({
  selector: 'app-chat-test',
  imports: [MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatCardModule, MatIconModule],
  templateUrl: './chat-test.html',
  styleUrls: ['./chat-test.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTest {
  readonly message = signal('');
  readonly response = signal<string | null>(null);
  readonly inFlight = signal(false);
  readonly canSend = computed(() => !!this.message().trim() && !this.inFlight());

  private ai = inject(AiService);

  send() {
    const m = this.message().trim();
    if (!m || this.inFlight()) return;
    this.inFlight.set(true);
    this.response.set(null);
    this.ai.sendMessage(m).subscribe({
      next: (resp) => {
        this.response.set(resp ?? '');
        this.inFlight.set(false);
      },
      error: (err) => {
        this.response.set('Error: ' + (err?.message ?? 'Unknown error'));
        this.inFlight.set(false);
      },
    });
  }
}

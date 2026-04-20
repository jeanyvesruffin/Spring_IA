import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfigService } from '../config-service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private config = inject(ConfigService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  protected readonly saved = signal(false);

  protected readonly form = this.fb.group({
    apiBaseUrl: [this.config.apiBaseUrl(), Validators.required],
    timeoutMs: [this.config.timeoutMs(), [Validators.required, Validators.min(1000), Validators.max(120000)]],
    maxHistory: [this.config.maxHistory(), [Validators.required, Validators.min(1), Validators.max(500)]],
  });

  save() {
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    this.config.override({
      apiBaseUrl: values.apiBaseUrl ?? undefined,
      timeoutMs: values.timeoutMs ?? undefined,
      maxHistory: values.maxHistory ?? undefined,
    });
    this.saved.set(true);
    this.snackBar.open('Param\u00e8tres sauvegard\u00e9s', 'OK', { duration: 3000 });
  }

  reset() {
    this.form.patchValue({
      apiBaseUrl: this.config.apiBaseUrl(),
      timeoutMs: this.config.timeoutMs(),
      maxHistory: this.config.maxHistory(),
    });
    this.saved.set(false);
  }
}

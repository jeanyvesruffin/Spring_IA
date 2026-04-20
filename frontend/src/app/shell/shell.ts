import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  protected readonly opened = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Chat', route: '/chat', icon: 'chat' },
    { label: 'Tester', route: '/tester', icon: 'api' },
    { label: 'Settings', route: '/settings', icon: 'settings' },
    { label: 'History', route: '/history', icon: 'history' },
  ];

  toggle() {
    this.opened.update((v) => !v);
  }
}

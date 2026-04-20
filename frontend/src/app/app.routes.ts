import { Routes } from '@angular/router';
import { AppShell } from './shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'chat', loadComponent: () => import('./chat-test/chat-test').then(m => m.ChatTest) },
      { path: 'tester', loadComponent: () => import('./tester/tester').then(m => m.Tester) },
      { path: 'settings', loadComponent: () => import('./settings/settings').then(m => m.Settings) },
      { path: 'history', loadComponent: () => import('./history/history').then(m => m.History) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

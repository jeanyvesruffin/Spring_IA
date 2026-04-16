
## Plan: Implémentation ordonnée — Frontend Angular 21

TL;DR: Déployer un frontend Angular 21 (standalone components, signals, OnPush) pour tester les endpoints backend (`GET /api?userInput`). Ordre recommandé, checklists et fichiers à créer/modifier pour que vous puissiez implémenter manuellement.

**Phases**
1. **Préparation**: vérifier environnement (Node / Angular CLI), installer dépendances, installer Angular Material, créer les fichiers `environment`.
2. **Services HTTP & config**: créer `ApiService`, `ConfigService`, `StorageService` (history/localStorage).
3. **Shell & routage**: créer `AppShell` (sidenav burger + topbar) et routes vers pages principales.
4. **Pages principales**: `ChatTest`, `GenericEndpointTester`, `Settings`, `History`.
5. **UX & robustesse**: toasts, spinner global, timeout/retry, gestion d'erreurs, accessibilité AXE.
6. **Tests & QA**: unit tests services/composants, vérifications manuelles, E2E optionnel.
7. **Build & déploiement**: `environment.prod`, `ng build --configuration=production`, retirer secrets du repo.

**Ordre d'exécution recommandé (prioritaire)**
1. Préparation: `npm install`, `ng add @angular/material`, créer `environment.ts` / `environment.prod.ts`.
2. Core HTTP: créer `ApiService` et `ConfigService` puis exposer `HttpClient` (bootstrap providers si nécessaire).
3. AppShell + routage: créer la navigation et routes vides pour itérer rapidement.
4. ChatTest: UI pour `GET /api?userInput`, gestion loading/erreur, sauvegarde history.
5. GenericEndpointTester: builder pour tester d'autres endpoints si besoin.
6. Settings & History: config runtime (timeout, apiBaseUrl) et export cURL/JSON.
7. Polish & tests: toasts, AXE checks, tests unitaires.

**Checklists détaillées (3 premières tâches)**
- **Tâche 1 — Préparation**
  - Installer dépendances: exécuter `cd frontend` puis `npm install`.
  - Ajouter Angular Material: `ng add @angular/material` (choisir thème et animations).
  - Créer `frontend/src/environments/environment.ts` et `frontend/src/environments/environment.prod.ts` avec `apiBaseUrl` (ex: `http://localhost:8086`).
  - Vérifier que le backend tourne en local sur le port `8086`.
- **Tâche 2 — Core HTTP & config**
  - Créer `frontend/src/app/services/api.service.ts` (méthode principale: `sendMessage(userInput: string): Observable<string>` utilisant `HttpClient.get` avec `responseType: 'text'`).
  - Créer `frontend/src/app/services/config.service.ts` (fournit `apiBaseUrl`, `timeoutMs`, `maxHistory` à partir de `environment`).
  - Créer `frontend/src/app/services/storage.service.ts` (méthodes: `saveRequest(record)`, `getHistory()`, `clearHistory()`).
  - Assurez-vous que `HttpClient` est disponible via providers (`provideHttpClient()` in bootstrap or import `HttpClientModule`).
- **Tâche 3 — AppShell & routage**
  - Créer `frontend/src/app/app-shell/app-shell.component.ts` (MatSidenav + topbar + burger icon).
  - Mettre à jour `frontend/src/app/app.routes.ts` pour déclarer routes: `/`, `/chat`, `/tester`, `/settings`, `/history`.
  - Ajouter les liens de navigation et un espace `router-outlet`.

**Fichiers clés à créer/modifier**
- `frontend/src/environments/environment.ts` — définir `apiBaseUrl`.
- `frontend/src/app/services/api.service.ts` — wrapper `HttpClient`.
- `frontend/src/app/services/config.service.ts` — lecture des envs.
- `frontend/src/app/services/storage.service.ts` — `localStorage` history.
- `frontend/src/app/app-shell/app-shell.component.ts` — Material sidenav.
- `frontend/src/app/chat-test/chat-test.component.ts` — page principale du cas Chat.

**Vérifications & critères d'acceptance**
- Le frontend appelle `GET /api?userInput=...` et affiche la réponse texte.
- UI empêche envoi si `userInput` vide (use case 2).
- En cas d'erreur 5xx, afficher message et proposer retry (use case 3).
- Timeout configurable: si délai dépassé, afficher message clair (use case 5).
- Historique persistant en `localStorage` et exportable en JSON/cURL (use case 6).

**Rappels sécurité & ops**
- Ne pas committer de clés API: vérifier [backend/configurations_partage/src/main/resources/shared-application.properties](backend/configurations_partage/src/main/resources/shared-application.properties).
- CORS: vous avez choisi activation côté backend; config Spring à ajouter si nécessaire (mapper l'origine `http://localhost:4200`).

**Ce que je fournis ensuite (sur demande)**
- Snippets prêts à coller pour `ApiService`, `ConfigService`, `StorageService`, `ChatTest`, `AppShell` (TS + template + styles).
- Checklist d'implémentation pas-à-pas pour chaque composant/service.
- Relecture et corrections de code que vous collez ici (perfs, sécurité, accessibilité).

**Prochaine action recommandée**
- Commencer par la **Tâche 1 (Préparation)**: installer Material et créer `environment` files, puis me demander le snippet pour `ApiService`.

--
Plan mis à jour et sauvegardé dans `/memories/session/plan.md`.
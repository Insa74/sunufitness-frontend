# CLAUDE.md

Instructions pour Claude Code dans ce dépôt : le **frontend** de SUNUFITNESS (sunufitness.com).

## ⚠️ Règle n°1 : push sur `dev_jerry` = mise en production

Le workflow `.github/workflows/deploy.yml` construit le site et le déploie par FTPS sur Namecheap **à chaque push sur `dev_jerry`**, sans aucun contrôle (pas de type-check, pas de lint, pas de tests).

- Toujours travailler sur une branche `feature/*` créée depuis `dev_jerry`.
- Ne jamais pousser (`git push`), ni fusionner dans `dev_jerry`, sans l'accord explicite d'Insa pour cette opération précise.
- Montrer le diff complet avant tout commit.
- Ne pas toucher à `.github/workflows/`, au build (`vite.config.ts`, `package.json`, `index.html`) ou au backend sans demande explicite.

## Stack

- React 18 + TypeScript 5.7 + Vite 5, SPA ; routage `react-router-dom` 6.0.2 (`src/Routes.tsx`).
- Tailwind 3.4, Font Awesome (CDN), Google Fonts.
- `recharts`, `qrcode.react`, `html5-qrcode`.
- Projet d'origine Rocket/DhiWise : ne pas modifier le bloc `rocketCritical` de `package.json`, le plugin `@dhiwise/component-tagger` ni le script `static.rocket.new` de `index.html` sans décision explicite.
- Sortie de build : `build/` (contient `public/.htaccess` pour la réécriture SPA et le cache).

## Commandes

```bash
npm run dev          # serveur de dev sur http://localhost:4028 (proxy /api -> http://localhost:8000)
npx tsc --noEmit     # vérification des types (5 erreurs préexistantes (Admin/Coaches, Admin/Schedule, Coach/MemberWorkspace, Home) : ne pas en ajouter)
npm run build        # tsc --noCheck && vite build -> build/
npm run preview      # sert le build localement
```

Il n'y a ni ESLint ni tests automatisés pour l'instant.

## Carte des backends

| Client | Fichier | URL de base (défaut si aucune variable `VITE_*`) | Utilisé par |
|---|---|---|---|
| `apiClient` (session membre) | `src/services/apiClient.ts` | `API.BASE_URL` → `https://api.sunufitness.com/api` | auth membre, profil, abonnements, réservations, services, newsletter |
| `caisseApi` / `caisseApiDownload` (session staff, PIN) | `src/services/caisseApiClient.ts` | `API.BASE_URL` → `https://api.sunufitness.com/api` | caisse, admin, agenda, espace coach |
| `fetch` direct | `Scan`, `MyQr`, `MenuBoissons`, `tokenService` | `API.BASE_URL` via `apiUrl()` | check-in QR, menu public, tokens |
| `fetch` direct | `PrepaMarathon`, `Admin/Marathon`, `components/marathon/*` | `MARATHON_API_BASE` → `https://admin.sunufitness.com/api` (`src/config/marathon.ts`) | Prépa Marathon |
| Tiers | `Preferences` (Formspree), `Payment` (liens Wave) | — | — |

- Le CI ne définit aucune variable `VITE_*` : en production, ce sont les valeurs par défaut ci-dessus qui s'appliquent.
- Les rôles staff (`coach`, `admin`, `super_admin`) sont vérifiés côté client par `AdminProtectedRoute`/`CoachProtectedRoute`, mais la vraie barrière est côté backend (`check.role`).

### Déploiement du backend (vérifié sur le serveur)

- **Un seul backend Laravel** : dépôt `Insa74/sunufitness-backend-`, branche `dev_jerry` (clone local : `~/Downloads/admin_sunufitness_backend`), avec **une seule base MySQL partagée**.
- **Deux copies du code sur le serveur**, au même commit :
  - `~/api.sunufitness.com/sunu_fitness` → servie sur `api.sunufitness.com` (utilisée par presque tout le frontend) ;
  - `~/admin.sunufitness.com` → servie sur `admin.sunufitness.com` (utilisée par la Prépa Marathon).
- Toute mise à jour du backend = `git pull` dans **les deux** dossiers, puis `php artisan route:clear` dans chacun.
- Une migration ne se lance **qu'une seule fois** (la base est partagée).
- C'est Insa qui fait ces opérations sur le serveur : ne jamais les lancer soi-même. Les rappeler à la fin d'une tâche qui touche le backend.
- Une nouvelle fonctionnalité doit fonctionner sur **les deux domaines**.

### Règle réseau

- **Interdit** : toute requête POST/PUT/PATCH/DELETE vers la production (`sunufitness.com`, `api.sunufitness.com`, `admin.sunufitness.com`).
- Seules des requêtes GET en lecture sont permises vers la production, et chacune doit être signalée à Insa.
- Pour toute écriture, utiliser un backend local (`php artisan serve` sur `localhost:8000`, via le proxy Vite).
- Ne jamais lire ni afficher le contenu des fichiers `.env*` ou des secrets.

## Organisation du code

- `src/pages/*` : une page par dossier ; `src/pages/Admin/*` pour les modules admin.
- `src/components/{common,marathon,ui}` ; les gardes de routes dans `src/components/*ProtectedRoute.tsx`.
- `src/config/` : `api.ts` (endpoints, `apiUrl`), `marathon.ts`, `storageKeys.ts`.
- `src/context/AuthContext.tsx` : session membre (tokens dans `localStorage`).
- Pour le staff, utiliser `caisseApi` ; pour les membres, `apiClient`. Ne pas ajouter de nouveau `fetch` direct vers l'API sans raison.

## Conventions

- Tous les textes visibles sont en **français**, avec les accents.
- Montants : espace insécable entre les milliers et avant la devise (ex. `15 000 F` avec U+00A0).
- Marque : « SUNUFITNESS », « Team SUNUFITNESS ».
- Commentaires de code et messages de commit en français, courts, préfixés par la fonctionnalité (ex. `Prépa Marathon : …`).
- Suivre le style du fichier modifié (composants fonctionnels, Tailwind, typage TypeScript ; éviter d'ajouter des `any`).

## Avant de conclure une tâche

1. `npx tsc --noEmit` : pas de nouvelle erreur par rapport aux 5 préexistantes.
2. `npm run build` réussit.
3. Vérifier à la main les écrans touchés via `npm run dev` (public, membre, caisse, admin selon le cas).
4. Faire relire la branche par l'agent `controleur-qualite` ; corriger tout point BLOQUANT avant de proposer la fusion.
5. Montrer le diff complet ; ne pas committer ni pousser sans accord.

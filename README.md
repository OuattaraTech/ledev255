# Portfolio — Ouattara Yaya · DEV225

Portfolio personnel animé, construit en React + Three.js, pensé mobile-first et déployé sur Cloudflare Pages.

**Stack** : Vite · React 18 · TypeScript · Tailwind CSS · Three.js (react-three-fiber) · Framer Motion · Lenis

---

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
```

Autres commandes :

```bash
npm run build       # génère dist/
npm run preview     # sert le build de production
npm run preview:cf  # idem, mais avec les fonctions Cloudflare
npm run typecheck   # vérification TypeScript
npm run deploy      # build puis publication sur Cloudflare Pages
```

---

## Modifier le contenu

**Tout le texte du site vit dans un seul fichier : `src/data/content.ts`.**

Aucune connaissance de React n'est nécessaire pour le mettre à jour. Le fichier est découpé en blocs :

| Bloc | Ce qu'il contient |
| --- | --- |
| `identity` | Nom, alias, rôles, accroche, ville, chemin de la photo |
| `socials` | Liens GitHub, LinkedIn, X, WhatsApp |
| `contact` | Email et téléphone affichés |
| `stats` | Les quatre chiffres du bandeau d'accueil |
| `journey` | Les étapes du parcours (timeline) |
| `skills` | Les quatre groupes de compétences et leurs niveaux |
| `skillNodes` | Les technologies affichées dans la sphère 3D |
| `aiPillars` / `aiMetrics` | La section IA & productivité |
| `projects` | Les projets. `featured: true` = mis en avant en grand |
| `ongoing` | Les projets en cours et leur avancement |
| `services` | Les trois offres de la fiche « Ce que je fais » |

### À faire avant la mise en ligne

Les blocs marqués `⚠️ À REMPLACER` contiennent des exemples cohérents avec le profil, pas des données réelles :

1. `projects` — les cinq projets et leurs liens `demo` / `repo`
2. `ongoing` — les projets réellement en cours
3. `socials` — les vraies URL
4. `contact.email` et `contact.phoneDisplay`
5. `stats` — les chiffres exacts

### Remplacer la photo

Deux fichiers sont utilisés :

- `identity.photo` — l'original, servi comme aperçu pour les réseaux sociaux
- `identity.photoCut` — la version détourée sur fond transparent, affichée sur le site

Pour changer de photo, déposer le nouveau fichier dans `public/imgs/`, puis générer le détourage :

```bash
pip install onnxruntime pillow numpy
python3 scripts/detourer-photo.py public/imgs/ma_photo.jpg
```

Le script écrit `ma_photo_cut.webp` à côté du fichier source. Il reste à pointer `identity.photo` et `identity.photoCut` sur les deux fichiers. Le modèle de segmentation est téléchargé une seule fois dans `~/.cache/portfolio-cutout/`.

Le fondu vers le bas et sur les côtés qui fait disparaître les épaules dans le fond de la page est géré en CSS, dans la classe `.mask-portrait` de `src/index.css`.

---

## Formulaire de contact

Par défaut, le formulaire ouvre le client mail du visiteur avec un message pré-rempli. Aucun serveur requis.

Pour recevoir les messages directement, ouvrir `src/sections/Contact.tsx` et renseigner `FORM_ENDPOINT` avec une URL de service (Formspree, Web3Forms, ou une Function Cloudflare Pages). Le formulaire enverra alors un `POST` en `FormData` et affichera l'état d'envoi.

---

## Compteur de visiteurs

Le nombre de visiteurs affiché dans le bandeau d'accueil vient du site lui-même, pas d'un service tiers. Une fonction Cloudflare Pages (`functions/api/views.js`) lit et incrémente un compteur stocké dans Cloudflare KV.

Un même navigateur n'est compté qu'une fois toutes les 24 heures, ce qui garde la métrique parlante et le nombre d'écritures très bas.

**Activation, une seule fois :**

1. Cloudflare Dashboard → **Storage & Databases** → **KV** → **Create namespace**, par exemple `ledev255-views`.
2. Aller sur le projet Pages → **Settings** → **Bindings** → **Add** → **KV namespace**.
3. Nom de la variable : `VIEWS`. Namespace : celui créé à l'étape 1. Enregistrer.
4. Redéployer.

Tant que ce binding n'existe pas, la route répond 503 et la tuile « Visiteurs » disparaît simplement du bandeau. Rien d'autre n'est affecté.

**Tester en local**, avec un KV simulé sur la machine :

```bash
npm run preview:cf      # http://localhost:8788
```

Le serveur de développement habituel (`npm run dev`) ne sert pas les fonctions : le compteur n'y apparaît pas, c'est normal.

---

## Assistante IA

Kora répond aux visiteurs sur le parcours, les compétences et les projets. Elle tourne sur **Cloudflare Workers AI**, inclus dans le plan gratuit : aucune clé d'API, aucune donnée envoyée à un service tiers.

**Sa fiche de connaissances** est construite automatiquement à partir de `src/data/content.ts` (voir `functions/api/_profil.js`). Ajouter un projet suffit à le lui apprendre.

**Son caractère et ses règles** se règlent dans `functions/api/_profil.js`, constante `SYSTEM`. Son prénom et ses phrases d'accueil sont dans `src/data/content.ts`, bloc `assistant`.

**Ce qu'elle sait faire au-delà de répondre :**

- emmener le visiteur à une section, ouvrir la fiche d'un projet, ouvrir WhatsApp — elle propose un bouton, le visiteur décide ;
- recueillir une demande (nom, contact, besoin) et l'enregistrer pour vous.

**Être prévenu sur Telegram à chaque demande :**

1. Dans Telegram, écrire à [@BotFather](https://t.me/BotFather), envoyer `/newbot`, suivre les questions. Il répond avec un jeton du type `123456:ABC-DEF…`.
2. Ouvrir une conversation avec le bot fraîchement créé et lui envoyer n'importe quel message (sans ça, il n'a pas le droit de vous écrire).
3. Ouvrir `https://api.telegram.org/bot<jeton>/getUpdates` dans un navigateur et relever le `chat.id` (un nombre).
4. Cloudflare Dashboard → le projet → Settings → Variables and Secrets, ajouter en **Secret** :
   - `TELEGRAM_BOT_TOKEN` = le jeton
   - `TELEGRAM_CHAT_ID` = le `chat.id`
5. Redéployer.

Tant que ces deux variables sont absentes, rien n'est envoyé et tout continue de fonctionner normalement. Un échec côté Telegram n'empêche jamais l'enregistrement de la demande.

**Relever les demandes reçues :**

```bash
npm run demandes
```

Le script lit le stockage KV du projet ; votre authentification Cloudflare suffit, il n'y a pas de secret à gérer.

Pour les consulter depuis un navigateur, définir une variable `LEADS_KEY` dans Cloudflare (Settings → Variables and Secrets) puis ouvrir `https://…/api/lead?k=<valeur>`. Sans cette variable, la route refuse tout accès.

**Garde-fous :** 30 messages par visiteur et par jour, longueur de question et historique plafonnés, refus des tentatives de détournement de consigne, interdiction d'inventer.

---

## Déploiement sur Cloudflare Pages

### Via l'interface web

1. Pousser le dépôt sur GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Sélectionner le dépôt, puis renseigner :

   | Réglage | Valeur |
   | --- | --- |
   | Framework preset | `Vite` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `20` (variable `NODE_VERSION`) |

4. **Save and Deploy**. Chaque `git push` sur la branche principale redéploie automatiquement.

### Via la ligne de commande

```bash
npm run deploy
```

Le dossier `public/` contient déjà `_headers` (cache et en-têtes de sécurité) et `_redirects` (repli SPA). Cloudflare les applique automatiquement.

---

## Performance et accessibilité

Le site adapte sa charge graphique à l'appareil :

- **Détection du niveau de l'appareil** (`src/lib/perf.ts`) — mémoire, cœurs CPU, type de pointeur, mode économie de données. Trois paliers pilotent le nombre de particules, la finesse des maillages, le ratio de pixels et l'activation des post-effets.
- **Scènes montées à la demande** — chaque canvas WebGL n'existe que lorsque sa section approche de l'écran, via `IntersectionObserver`.
- **Dégradation automatique** — `PerformanceMonitor` réduit la résolution de rendu si le taux d'images chute.
- **Repli sans WebGL** — si le navigateur ne peut pas rendre de 3D, la photo et les dégradés CSS prennent le relais. Une erreur dans une scène n'affecte jamais le reste de la page.
- **Interrupteur d'animations** — un bouton dans la barre de navigation coupe les scènes 3D, le défilement fluide, les apparitions au scroll et les animations CSS. Le choix est mémorisé dans le navigateur. Par défaut il suit `prefers-reduced-motion`, le réglage du système.
- Navigation au clavier, lien d'évitement, focus visible, contrastes tenus sur fond sombre.

---

## Structure

```
src/
├── data/content.ts        ← tout le contenu éditorial
├── sections/              ← les sept sections de la page
├── components/
│   ├── three/             ← scènes WebGL (nébuleuse, globe, hélice, aurore)
│   ├── primitives.tsx     ← briques d'animation réutilisables
│   ├── Nav.tsx  Preloader.tsx  Cursor.tsx  SmoothScroll.tsx
├── hooks/                 ← media queries, visibilité
└── lib/                   ← détection matérielle, bruit GLSL
```

---

© Ouattara Yaya — DEV225

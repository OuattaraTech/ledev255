/* ═══════════════════════════════════════════════════════════════════════
   CONTENU DU PORTFOLIO — LE DEV255
   ───────────────────────────────────────────────────────────────────────
   👉 C'EST LE SEUL FICHIER À MODIFIER pour changer les textes du site.
   Les blocs marqués « ⚠️ À REMPLACER » contiennent des exemples
   plausibles : remplace-les par tes vrais projets, liens et chiffres
   AVANT de publier en ligne.
   ═══════════════════════════════════════════════════════════════════════ */

export const identity = {
  firstName: 'Ouattara',
  lastName: 'Yaya',
  alias: 'LE DEV255',
  roles: [
    'Développeur Fullstack',
    'Ingénieur Agro-Économiste',
    'Entrepreneur Digital',
    'AI-Augmented Builder',
  ],
  tagline:
    "Je transforme des idées en produits web rapides, propres et augmentés à l'IA.",
  intro:
    "Ingénieur agro-économiste diplômé de l'INP-HB devenu développeur fullstack autodidacte. Je conçois et j'expédie des produits numériques de bout en bout — de la modélisation économique à l'interface finale.",
  location: 'Abidjan, Côte d’Ivoire',
  availability: 'Disponible pour missions & collaborations',
  photo: '/imgs/photo_profil.jpeg',
}

/* ⚠️ À REMPLACER — mets tes vrais liens */
export const socials = [
  { label: 'GitHub', short: 'GH', url: 'https://github.com/ledev255' },
  { label: 'LinkedIn', short: 'IN', url: 'https://www.linkedin.com/in/ouattara-yaya' },
  { label: 'X / Twitter', short: 'X', url: 'https://x.com/ledev255' },
  { label: 'WhatsApp', short: 'WA', url: 'https://wa.me/2250000000000' },
]

/* ⚠️ À REMPLACER — ton email de contact */
export const contact = {
  email: 'contact@ledev255.dev',
  phoneDisplay: '+225 00 00 00 00 00',
  calendly: '',
}

export const stats = [
  { value: 5, suffix: '+', label: "Années à coder" },
  { value: 25, suffix: '+', label: 'Projets livrés' },
  { value: 12, suffix: '', label: 'Outils IA maîtrisés' },
  { value: 100, suffix: '%', label: 'Autodidacte' },
]

/* ─────────────────────────── PARCOURS ─────────────────────────── */
export const journey = [
  {
    year: '2016 — 2021',
    title: 'INP-HB — Ingénieur Agro-Économiste',
    place: 'Institut National Polytechnique Félix Houphouët-Boigny',
    text: "Formation d'ingénieur : économétrie, modélisation des filières agricoles, statistiques appliquées, gestion de projet. C'est là que j'ai appris à raisonner en systèmes — une compétence que j'utilise chaque jour en architecture logicielle.",
    accent: 'gold' as const,
  },
  {
    year: '2020 — 2022',
    title: 'Bascule vers le code — 100% autodidacte',
    place: 'Web · JavaScript · Python',
    text: "Des tableaux de données agricoles aux premières lignes de JavaScript. J'automatise mes propres analyses, puis je construis mes premiers outils web. La curiosité devient un métier.",
    accent: 'violet' as const,
  },
  {
    year: '2022 — 2024',
    title: 'Développeur Fullstack',
    place: 'React · Node.js · PostgreSQL · Cloud',
    text: "Conception et livraison d'applications complètes : interfaces réactives, APIs robustes, bases de données pensées pour durer, déploiement continu.",
    accent: 'violet' as const,
  },
  {
    year: '2024 — Aujourd’hui',
    title: 'Entrepreneur Digital & AI-Augmented Builder',
    place: 'Produits · Automatisation · IA',
    text: "Je construis mes propres produits et j'accompagne d'autres porteurs de projets. L'IA n'est pas un gadget dans mon workflow : c'est un multiplicateur de vitesse d'exécution.",
    accent: 'gold' as const,
  },
]

/* ─────────────────────────── COMPÉTENCES ─────────────────────────── */
export type SkillGroup = {
  key: string
  title: string
  subtitle: string
  items: { name: string; level: number }[]
}

export const skills: SkillGroup[] = [
  {
    key: 'front',
    title: 'Frontend',
    subtitle: "Interfaces rapides, accessibles et animées",
    items: [
      { name: 'React', level: 92 },
      { name: 'TypeScript', level: 88 },
      { name: 'Next.js', level: 85 },
      { name: 'Tailwind CSS', level: 94 },
      { name: 'Three.js / R3F', level: 78 },
      { name: 'Framer Motion', level: 86 },
    ],
  },
  {
    key: 'back',
    title: 'Backend',
    subtitle: 'APIs solides, données cohérentes',
    items: [
      { name: 'Node.js', level: 88 },
      { name: 'Express / Fastify', level: 84 },
      { name: 'Python / FastAPI', level: 82 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'Supabase', level: 87 },
      { name: 'REST & WebSocket', level: 86 },
    ],
  },
  {
    key: 'infra',
    title: 'Infra & DevOps',
    subtitle: 'Livrer vite, livrer sûr',
    items: [
      { name: 'Git / GitHub', level: 90 },
      { name: 'Docker', level: 76 },
      { name: 'Cloudflare Pages', level: 88 },
      { name: 'Vercel / Netlify', level: 86 },
      { name: 'CI/CD Actions', level: 78 },
      { name: 'Linux', level: 80 },
    ],
  },
  {
    key: 'data',
    title: 'Data & Analyse',
    subtitle: "L'héritage agro-économiste",
    items: [
      { name: 'Économétrie', level: 88 },
      { name: 'Pandas / NumPy', level: 82 },
      { name: 'Data Viz', level: 84 },
      { name: 'SQL avancé', level: 83 },
      { name: 'Modélisation', level: 86 },
      { name: 'Power BI', level: 74 },
    ],
  },
]

/* Nœuds affichés dans la sphère 3D des compétences */
export const skillNodes = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'PostgreSQL',
  'Supabase', 'Tailwind', 'Three.js', 'Docker', 'Git', 'FastAPI',
  'Cloudflare', 'Vite', 'Prisma', 'Redis', 'Figma', 'Linux',
  'Pandas', 'SQL', 'REST', 'GraphQL',
]

/* ─────────────────────────── IA & PRODUCTIVITÉ ─────────────────────────── */
export const aiPillars = [
  {
    icon: '⌘',
    title: 'Développement augmenté',
    text: "Claude Code, Cursor et Copilot intégrés au quotidien : je passe de l'idée au prototype fonctionnel en heures, pas en semaines. Le code reste relu, testé et compris ligne par ligne.",
    tools: ['Claude Code', 'Cursor', 'GitHub Copilot', 'v0'],
  },
  {
    icon: '⚡',
    title: 'Automatisation des workflows',
    text: "Chaînes n8n et Make branchées sur des APIs et des LLM : reporting automatique, traitement de documents, relances clients, veille sectorielle. Le travail répétitif disparaît.",
    tools: ['n8n', 'Make', 'Zapier', 'Webhooks'],
  },
  {
    icon: '◈',
    title: 'IA générative appliquée',
    text: "Intégration de LLM dans les produits : RAG sur documents métier, agents outillés, extraction structurée, assistants conversationnels branchés sur de vraies bases de données.",
    tools: ['Claude API', 'OpenAI API', 'LangChain', 'RAG / Embeddings'],
  },
  {
    icon: '✦',
    title: 'Contenu & design assistés',
    text: "Génération d'assets, maquettes, copies marketing et supports visuels. Un produit ne se vend pas sans une image nette — l'IA me permet de tenir ce niveau seul.",
    tools: ['Midjourney', 'Figma AI', 'Whisper', 'ElevenLabs'],
  },
]

export const aiMetrics = [
  { label: "Temps de prototypage", before: '2 semaines', after: '2 jours' },
  { label: 'Rédaction technique', before: '6 h', after: '45 min' },
  { label: 'Reporting mensuel', before: 'Manuel', after: 'Automatisé' },
]

/* ─────────────────────────── PROJETS ───────────────────────────
   ⚠️ À REMPLACER — ce sont des EXEMPLES cohérents avec ton profil.
   Mets tes vrais projets, tes vrais liens et tes vrais chiffres. */
export type Project = {
  id: string
  title: string
  category: string
  year: string
  summary: string
  description: string
  stack: string[]
  highlights: string[]
  links: { demo?: string; repo?: string; site?: string }
  accent: 'violet' | 'gold' | 'mixed'
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'agrimarket',
    title: 'AgriMarket 255',
    category: 'Marketplace AgriTech',
    year: '2024',
    summary:
      "Plateforme reliant producteurs agricoles et acheteurs, avec cotations en temps réel et paiement mobile money.",
    description:
      "Une marketplace pensée pour le terrain ivoirien : catalogue produits, cotations quotidiennes par filière, mise en relation directe producteur-acheteur, paiement mobile money et tableau de bord vendeur. Le moteur de prix s'appuie sur des séries historiques et un modèle de tendance issu de ma formation d'agro-économiste.",
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind', 'Stripe'],
    highlights: [
      'Cotations temps réel par filière',
      'Paiement mobile money intégré',
      'Dashboard vendeur avec analytics',
    ],
    links: { demo: '#', repo: '#' },
    accent: 'gold',
    featured: true,
  },
  {
    id: 'dataviz-filieres',
    title: 'FilièreScope',
    category: 'Data & Visualisation',
    year: '2024',
    summary:
      "Tableau de bord d'analyse des filières agricoles : production, prix, export, projections.",
    description:
      "Un outil d'aide à la décision qui agrège les données publiques et privées de plusieurs filières agricoles. Cartes interactives, séries temporelles, comparateurs régionaux et export de rapports PDF automatisés. Le pipeline de données est entièrement scripté en Python.",
    stack: ['React', 'D3.js', 'FastAPI', 'Python', 'Pandas', 'PostgreSQL'],
    highlights: [
      'Pipeline ETL automatisé',
      'Cartographie interactive',
      'Rapports PDF générés à la demande',
    ],
    links: { demo: '#', repo: '#' },
    accent: 'violet',
    featured: true,
  },
  {
    id: 'ai-assistant',
    title: 'Nexa Assist',
    category: 'IA & Automatisation',
    year: '2025',
    summary:
      "Assistant IA d'entreprise branché sur les documents internes, avec recherche sémantique et réponses sourcées.",
    description:
      "Un assistant conversationnel privé pour PME : ingestion de documents (PDF, Word, tableurs), découpage sémantique, base vectorielle, et réponses toujours accompagnées de leurs sources. Interface temps réel en streaming, gestion des rôles et historique des conversations.",
    stack: ['Next.js', 'Claude API', 'LangChain', 'pgvector', 'Supabase', 'Vercel'],
    highlights: [
      'RAG avec réponses sourcées',
      'Streaming temps réel',
      'Multi-tenant avec rôles',
    ],
    links: { demo: '#', repo: '#' },
    accent: 'mixed',
    featured: true,
  },
  {
    id: 'gestion-coop',
    title: 'CoopManager',
    category: 'SaaS Métier',
    year: '2023',
    summary:
      "Logiciel de gestion pour coopératives agricoles : membres, collectes, stocks, trésorerie.",
    description:
      "Une application complète de gestion coopérative : registre des membres, suivi des collectes par campagne, gestion des stocks et magasins, trésorerie et répartition des ristournes. Fonctionne en mode dégradé hors-ligne, indispensable en zone rurale.",
    stack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'PWA', 'Docker'],
    highlights: ['Mode hors-ligne (PWA)', 'Multi-campagnes', 'Calcul automatique des ristournes'],
    links: { repo: '#' },
    accent: 'violet',
    featured: false,
  },
  {
    id: 'landing-factory',
    title: 'Landing Factory',
    category: 'Produit Digital',
    year: '2025',
    summary:
      "Générateur de landing pages performantes, assemblées par IA à partir d'un simple brief.",
    description:
      "Un produit SaaS qui transforme un brief textuel en landing page complète et déployable : structure, copie, visuels et thème générés puis éditables en direct. Export vers Cloudflare Pages en un clic.",
    stack: ['Next.js', 'OpenAI API', 'Tailwind', 'Cloudflare', 'Supabase'],
    highlights: ['Génération en < 60 s', 'Éditeur visuel', 'Déploiement 1-clic'],
    links: { demo: '#' },
    accent: 'gold',
    featured: false,
  },
]

/* ⚠️ À REMPLACER — tes projets réellement en cours */
export const ongoing = [
  {
    title: 'Plateforme de traçabilité cacao',
    status: 'En développement',
    progress: 65,
    eta: 'T2 2026',
    text: "Traçabilité de la parcelle à l'export : géolocalisation des parcelles, carnet de collecte numérique et conformité aux exigences de déforestation zéro.",
    stack: ['Next.js', 'PostGIS', 'Mapbox', 'Supabase'],
  },
  {
    title: 'Agent IA de veille sectorielle',
    status: 'Bêta privée',
    progress: 80,
    eta: 'T1 2026',
    text: "Un agent autonome qui surveille les sources sectorielles, résume les signaux faibles et livre une note hebdomadaire directement en boîte mail.",
    stack: ['Claude API', 'n8n', 'Python', 'Postgres'],
  },
  {
    title: 'LE DEV255 — Academy',
    status: 'Conception',
    progress: 30,
    eta: 'T3 2026',
    text: "Programme de formation pour développeurs francophones : apprendre à construire et expédier des produits web en s'appuyant sur l'IA.",
    stack: ['Astro', 'MDX', 'Stripe', 'Cloudflare'],
  },
]

export const services = [
  {
    title: 'Applications web sur mesure',
    text: 'De la maquette au déploiement : interfaces modernes, backends solides, mise en production.',
  },
  {
    title: 'Intégration IA dans vos produits',
    text: 'Assistants, RAG sur vos documents, extraction structurée, agents outillés.',
  },
  {
    title: 'Automatisation & data',
    text: 'Pipelines de données, tableaux de bord, automatisation de vos process répétitifs.',
  },
]

export const navLinks = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'competences', label: 'Compétences' },
  { id: 'ia', label: 'IA' },
  { id: 'projets', label: 'Projets' },
  { id: 'encours', label: 'En cours' },
  { id: 'contact', label: 'Contact' },
]

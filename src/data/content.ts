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
  photo: '/imgs/photo_profil.jpeg', // original, utilisé pour l'aperçu réseaux sociaux
  photoCut: '/imgs/photo_profil_cut.webp', // détourée, affichée sur le site
}

export const socials = [
  {
    label: 'LinkedIn',
    short: 'IN',
    url: 'https://www.linkedin.com/in/yaya-ouattara-5620b934a',
  },
  { label: 'WhatsApp', short: 'WA', url: 'https://wa.me/message/7YUNZIZGUYNNE1' },
  {
    label: 'Facebook',
    short: 'FB',
    url: 'https://www.facebook.com/share/1Dc4uznhiD/',
  },
  { label: 'GitHub', short: 'GH', url: 'https://github.com/OuattaraTech' },
]

export const contact = {
  email: 'yayaouattara7875@gmail.com',
  phone: '+2250779667543',
  phoneDisplay: '+225 07 79 66 75 43',
  whatsapp: 'https://wa.me/message/7YUNZIZGUYNNE1',
}

/* ⚠️ À AJUSTER — seuls le nombre de projets et « autodidacte » sont vérifiés */
export const stats = [
  { value: 5, suffix: '+', label: "Années à coder" },
  { value: 6, suffix: '', label: 'Projets construits' },
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

/* ⚠️ Les pourcentages sont indicatifs : ajuste-les à ton ressenti réel. */
export const skills: SkillGroup[] = [
  {
    key: 'mobile',
    title: 'Mobile',
    subtitle: 'Applications terrain, y compris hors-ligne',
    items: [
      { name: 'Flutter', level: 90 },
      { name: 'Dart', level: 88 },
      { name: 'Mode hors-ligne', level: 85 },
      { name: 'Cartographie', level: 82 },
      { name: 'TensorFlow Lite', level: 72 },
      { name: 'Publication stores', level: 78 },
    ],
  },
  {
    key: 'web',
    title: 'Web',
    subtitle: 'Interfaces rapides et lisibles',
    items: [
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 82 },
      { name: 'React', level: 84 },
      { name: 'HTML / CSS', level: 92 },
      { name: 'Tailwind CSS', level: 88 },
      { name: 'Three.js / R3F', level: 68 },
    ],
  },
  {
    key: 'back',
    title: 'Backend & Données',
    subtitle: 'APIs solides, données cohérentes',
    items: [
      { name: 'Supabase', level: 90 },
      { name: 'PostgreSQL', level: 86 },
      { name: 'SQL avancé', level: 82 },
      { name: 'Node.js', level: 86 },
      { name: 'Python', level: 84 },
      { name: 'REST & temps réel', level: 84 },
    ],
  },
  {
    key: 'metier',
    title: 'Métier & Conformité',
    subtitle: "L'héritage agro-économiste",
    items: [
      { name: 'Comptabilité SYSCOHADA', level: 85 },
      { name: 'Fiscalité DGI / FNE', level: 82 },
      { name: 'Paie CNPS', level: 78 },
      { name: 'Filières agricoles', level: 90 },
      { name: 'Économétrie', level: 86 },
      { name: 'Mobile Money', level: 84 },
    ],
  },
]

export const skillNodes = [
  'Flutter', 'Dart', 'Supabase', 'PostgreSQL', 'JavaScript', 'TypeScript',
  'React', 'Node.js', 'Python', 'HTML', 'CSS', 'Tailwind',
  'TensorFlow Lite', 'MapTiler', 'OpenStreetMap', 'OCR',
  'Git', 'ReportLab', 'Netlify', 'Cloudflare', 'SQL', 'REST',
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

/* ─────────────────────────── PROJETS ─────────────────────────── */
export type Project = {
  id: string
  title: string
  category: string
  /** Laisser vide si l'année n'est pas pertinente : le badge disparaît. */
  year?: string
  /** Sigle affiché en filigrane sur la vignette. Déduit du titre si absent. */
  monogram?: string
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
    id: 'apex',
    title: 'ApeX',
    category: 'SaaS Gestion & Comptabilité',
    monogram: 'AX',
    summary:
      "Application cloud tout-en-un de gestion et de comptabilité pour les TPE et PME ivoiriennes, avec assistant IA intégré.",
    description:
      "ApeX est pensée pour le marché ivoirien, pas adaptée après coup. Elle couvre la gestion commerciale, les stocks, la paie, la trésorerie, le CRM et la gestion de projet dans une seule application, et génère la comptabilité au fil de l'eau. Chaque vente et chaque dépense produit ses écritures aux normes SYSCOHADA, jusqu'à la préparation de la liasse fiscale DSF. Les factures sont validées instantanément par la certification DGI / FNE, les encaissements passent par Mobile Money, et les pièces fournisseurs se saisissent en photo grâce à l'OCR.",
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python', 'PostgreSQL', 'ReportLab'],
    highlights: [
      'Certification fiscale DGI / FNE : factures normalisées validées instantanément',
      'Écritures SYSCOHADA générées automatiquement, jusqu’à la liasse fiscale DSF',
      'Encaissements Wave, Orange Money et MTN MoMo, lien de paiement envoyé par WhatsApp',
      'Saisie des factures fournisseurs par photo, sans ressaisie manuelle (OCR)',
      'Paie aux normes CNPS, congés et taxes sur salaire (ITS)',
      'Stocks multi-entrepôts et trésorerie prévisionnelle',
    ],
    links: { site: 'https://useapex.ci/', demo: 'https://app.useapex.ci' },
    accent: 'gold',
    featured: true,
  },
  {
    id: 'masjid-finder',
    title: 'Masjid Finder',
    category: 'Application mobile communautaire',
    monogram: 'MF',
    summary:
      "Connecte les musulmans aux mosquées autour d'eux : horaires de prière validés localement et itinéraire GPS immédiat.",
    description:
      "Masjid Finder combine les données ouvertes d'OpenStreetMap et l'engagement de la communauté. Des points focaux valident localement les horaires de prière, ce qui règle le problème des données génériques et souvent fausses. L'application reste volontairement simple : trouver une mosquée proche, connaître l'heure exacte de la prochaine prière, et lancer l'itinéraire.",
    stack: ['Flutter', 'Supabase', 'PostgreSQL', 'MapTiler'],
    highlights: [
      'Horaires de prière validés par des points focaux locaux',
      'Recensement des mosquées appuyé sur OpenStreetMap',
      'Itinéraire GPS lancé en un geste',
    ],
    links: {},
    accent: 'violet',
    featured: true,
  },
  {
    id: 'cnyts',
    title: 'Cnyts',
    category: 'Application interne de gestion',
    monogram: 'CN',
    summary:
      "Application de gestion interne des opérations financières et de suivi de la performance du personnel.",
    description:
      "Cnyts réunit deux besoins d'entreprise dans une seule application mobile : le suivi des opérations financières internes d'un côté, le suivi de la performance du personnel de l'autre. Les données sont centralisées et consultables en temps réel, ce qui remplace les tableurs partagés et les remontées d'information dispersées.",
    // ⚠️ À ENRICHIR — ajoute les fonctions marquantes et un chiffre si tu en as un
    highlights: [
      'Enregistrement et suivi des opérations financières internes',
      'Suivi de la performance des collaborateurs',
      'Données centralisées et consultables en temps réel',
    ],
    stack: ['Flutter', 'Supabase'],
    links: {},
    accent: 'mixed',
    featured: true,
  },
  {
    id: 'generateur-qrcode',
    title: 'Générateur de QR Code',
    category: 'Outil web',
    monogram: 'QR',
    summary:
      "Génère un QR code à partir d'un texte, d'une fiche de contact ou d'une adresse de site web.",
    description:
      "Un outil volontairement minimal, écrit en JavaScript natif, sans framework ni build. On choisit le type de contenu, on saisit, le QR code apparaît. Hébergé en statique, il se charge instantanément.",
    stack: ['HTML', 'CSS', 'JavaScript'],
    highlights: [
      'Trois formats : texte, fiche de contact, adresse web',
      'JavaScript natif, sans framework',
    ],
    links: { demo: 'https://generateur-qrcode.netlify.app/' },
    accent: 'mixed',
    featured: false,
  },
]

/* ─────────────────────────── PROJETS EN COURS ───────────────────────────
   ⚠️ Les pourcentages d'avancement et les échéances sont à ajuster. */
export const ongoing = [
  {
    title: 'AgroLink',
    status: 'En développement',
    progress: 55,
    eta: '',
    text: "Super-app agricole tout-en-un pour les producteurs ivoiriens : diagnostic des maladies des cultures par IA depuis une photo, prix du marché en direct, mise en relation producteur-acheteur et alertes météo.",
    stack: ['Flutter', 'Supabase', 'TensorFlow Lite'],
  },
  {
    title: 'KernSys',
    status: 'En développement',
    progress: 45,
    eta: '',
    text: "ERP agricole qui digitalise toute la chaîne d'une coopérative d'anacarde, de l'achat au producteur jusqu'à l'exportation. Une application mobile pour les pisteurs — collecte hors-ligne, pesée, paiement — et une application web pour la coopérative : stocks, qualité, trésorerie, comptabilité OHADA, ventes et rapports. Un outil clé en main qui remplace Excel et le papier, sécurise les flux financiers et garantit la traçabilité.",
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python', 'PostgreSQL', 'ReportLab'],
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

/* ═══════════════════════════════════════════════════════════════════════
   CONTENU DU PORTFOLIO — DEV225
   ───────────────────────────────────────────────────────────────────────
   👉 C'EST LE SEUL FICHIER À MODIFIER pour changer les textes du site.
   Les blocs marqués « ⚠️ À REMPLACER » contiennent des exemples
   plausibles : remplace-les par tes vrais projets, liens et chiffres
   AVANT de publier en ligne.
   ═══════════════════════════════════════════════════════════════════════ */

export const identity = {
  firstName: 'Ouattara',
  lastName: 'Yaya',
  alias: 'DEV225',
  tagline2: 'La référence digital',
  logo: '/imgs/logo-lockup.webp',
  logoFull: '/imgs/logo-full.webp',
  logoMark: '/imgs/logo-mark.webp',
  roles: [
    'Développeur Fullstack',
    'Élève Ingénieur Agro-Économiste',
    'Entrepreneur Digital',
    'AI-Augmented Builder',
  ],
  tagline:
    "Je transforme des idées en produits web rapides, propres et augmentés à l'IA.",
  intro:
    "Élève ingénieur agro-économiste à l'INP-HB, développeur fullstack autodidacte. Je conçois et j'expédie des produits numériques de bout en bout — de la modélisation économique à l'interface finale.",
  location: 'Yamoussoukro & Bouaké, Côte d’Ivoire',
  locationDetail:
    'Je travaille en distanciel avec des clients partout, et en présentiel sur Yamoussoukro et Bouaké.',
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

/* ─────────────────────────── PARCOURS ───────────────────────────
   Volontairement sans dates : ce sont des étapes, pas un calendrier. */
export const journey = [
  {
    phase: 'Le socle',
    title: 'Cycle ingénieur agro-économiste, INP-HB',
    place: 'Institut National Polytechnique Félix Houphouët-Boigny',
    text: "Économétrie, modélisation des filières agricoles, statistiques appliquées, conduite de projet. Une formation qui apprend à comprendre un système entier avant d'en toucher la moindre pièce. C'est exactement ce que réclame l'architecture logicielle. Cycle en cours d'achèvement.",
    accent: 'gold' as const,
  },
  {
    phase: 'Le déclic',
    title: 'Les premières lignes, juste après le bac',
    place: 'Autodidacte · Web & Python',
    text: "La curiosité prend le dessus dès la sortie du lycée. J'automatise d'abord mes propres analyses, puis je construis mes premiers outils web. Personne ne m'a enseigné le code : la documentation, les erreurs et l'obstination ont suffi.",
    accent: 'violet' as const,
  },
  {
    phase: 'La construction',
    title: 'Développeur fullstack',
    place: 'Flutter · Node.js · Python · PostgreSQL',
    text: "Des applications complètes, livrées de bout en bout : interfaces mobiles qui tiennent hors-ligne, APIs robustes, bases de données pensées pour durer, mise en production. Chaque projet a été l'occasion d'apprendre une brique de plus.",
    accent: 'violet' as const,
  },
  {
    phase: 'Aujourd’hui',
    title: 'Entrepreneur digital & AI-Augmented Builder',
    place: 'Produits · Automatisation · IA',
    text: "Je construis mes propres produits et j'accompagne d'autres porteurs de projets. Le terrain agricole et la conformité ivoirienne ne sont pas des contraintes que je subis : ce sont les deux endroits où ma formation et mon code se rejoignent. L'IA, elle, n'est pas un gadget dans mon workflow — c'est un multiplicateur de vitesse d'exécution.",
    accent: 'gold' as const,
  },
]

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

/* ⚠️ Ordres de grandeur illustratifs, pas des mesures. */
export const aiMetrics = [
  { label: "Temps de prototypage", before: '2 semaines', after: '2 jours' },
  { label: 'Rédaction technique', before: '6 h', after: '45 min' },
  { label: 'Reporting mensuel', before: 'Manuel', after: 'Automatisé' },
]

/* ─────────────────────────── CHAÎNE WHATSAPP ─────────────────────────── */
export const channel = {
  name: 'Deep Vision AI',
  platform: 'Chaîne WhatsApp',
  url: 'https://whatsapp.com/channel/0029VbDL8Xi0lwglQQchiw1A',
  pitch:
    "Ce que l'IA change dans mon travail, je ne le garde pas pour moi. Sur Deep Vision AI, je partage les outils qui tiennent vraiment la route, les automatisations qui font gagner des heures, et les erreurs qui en font perdre. Du concret, applicable dès le lendemain.",
  bullets: [
    'Les outils que j’utilise réellement, testés sur de vrais projets',
    'Des automatisations prêtes à reproduire, pas des démos de salon',
    'Ce qui ne marche pas — pour vous éviter d’y passer vos soirées',
  ],
  cta: 'Rejoindre la chaîne',
  note: 'Gratuit. Aucune inscription. Vous partez quand vous voulez.',
  /* Captures de la chaîne. Pour en ajouter : déposer le fichier dans
     public/imgs/chaine/ puis compléter cette liste. La galerie
     disparaît si le tableau est vide. */
  shots: [
    {
      src: '/imgs/chaine/chaine-rag.webp',
      alt: 'Publication comparant le RAG et le fine-tuning pour adapter une IA à une entreprise',
    },
    {
      src: '/imgs/chaine/chaine-n8n.webp',
      alt: 'Publication présentant n8n et l’automatisation de tâches répétitives',
    },
    {
      src: '/imgs/chaine/chaine-kobo.webp',
      alt: 'Publication montrant la création d’un formulaire Kobo avec Claude en cinq minutes',
    },
  ] as { src: string; alt: string }[],
}

/* ─────────────────────────── PROJETS ─────────────────────────── */
export type Project = {
  id: string
  title: string
  category: string
  /** Laisser vide si l'année n'est pas pertinente : le badge disparaît. */
  year?: string
  /** Sigle affiché en filigrane sur la vignette. Déduit du titre si absent. */
  monogram?: string
  /** Capture du projet. À défaut, une vignette est générée à partir du titre. */
  image?: string
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
    image: '/imgs/projets/apex.webp',
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
    id: 'kobotoolbox-mcp',
    title: 'Serveur MCP KoboToolbox',
    category: 'IA & Analyse de données',
    monogram: 'KO',
    image: '/imgs/projets/kobotoolbox-mcp.webp',
    summary:
      "Serveur MCP qui branche Claude sur KoboToolbox : créer les questionnaires d'enquête, analyser les réponses et livrer les rapports Excel, Word et PDF — depuis une conversation.",
    description:
      "KoboToolbox est l'outil de collecte de terrain des ONG et des projets de développement. Entre la fin de la collecte et le rapport, il reste pourtant l'export, la traduction des codes, les tableaux croisés et la mise en forme : souvent plusieurs jours de tableur. Ce serveur confie ce travail à Claude. Vingt-sept outils couvrent le cycle complet, de la création du questionnaire XLSForm jusqu'au rapport livré. Le partage des rôles est strict : Claude rédige l'analyse et déclare quels tableaux et quels graphiques produire, le serveur calcule tous les chiffres depuis les soumissions réelles. Les nombres du rapport ne peuvent donc pas diverger des données.",
    stack: ['TypeScript', 'Node.js', 'MCP SDK', 'Zod', 'Python', 'XlsxWriter', 'Matplotlib'],
    highlights: [
      'Le cycle entier : créer le questionnaire, le déployer, suivre la collecte, analyser, livrer',
      'Classeur Excel à graphiques natifs et éditables, rapport Word et PDF',
      'Claude rédige l’analyse, le serveur calcule les chiffres : aucun écart possible avec les données',
      'Données nettoyées automatiquement — codes traduits en libellés, groupes aplatis, rapport de qualité',
      'Liens de collecte, QR code imprimable et ouverture aux réponses anonymes',
      'XLSForm validé avant l’envoi : les erreurs sont signalées d’un coup, avec la question fautive',
    ],
    links: { repo: 'https://github.com/OuattaraTech/kobotoolbox-mcp-server' },
    accent: 'mixed',
    featured: true,
  },
  {
    id: 'masjid-finder',
    title: 'Masjid Finder',
    category: 'Mobilité & Communauté',
    monogram: 'MF',
    image: '/imgs/projets/masjid-finder.webp',
    summary:
      "Trouver une mosquée quand on ne connaît pas la ville : pensée pour les voyageurs, les touristes et les professionnels en déplacement.",
    description:
      "En déplacement, la question n'est pas de savoir quelle mosquée on préfère, mais laquelle se trouve à proximité et dans combien de temps commence la prochaine prière. Masjid Finder répond exactement à ça : la carte affiche les mosquées autour de soi, l'itinéraire se lance en un geste, et les horaires du jour sont validés localement par des points focaux plutôt que calculés de façon générique — car un horaire théorique ne correspond pas toujours à celui réellement pratiqué sur place. Le recensement s'appuie sur les données ouvertes d'OpenStreetMap, enrichies par la communauté.",
    stack: ['Flutter', 'Supabase', 'PostgreSQL', 'MapTiler'],
    highlights: [
      'Pensée pour les voyageurs, touristes et professionnels en déplacement',
      'Carte des mosquées alentour et itinéraire lancé en un geste',
      'Horaires validés localement, pas seulement calculés',
      'Recensement appuyé sur OpenStreetMap, enrichi par la communauté',
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
    id: 'robot-emploi',
    title: 'Robot Emploi CI',
    category: 'Automatisation & Veille',
    monogram: 'RE',
    image: '/imgs/projets/robot-emploi.webp',
    summary:
      "Un robot qui surveille en continu les sites d'emploi ivoiriens et envoie par email les offres qui correspondent à un profil précis.",
    description:
      "Chercher un emploi en Côte d'Ivoire, c'est visiter les mêmes sites plusieurs fois par jour et relire les mêmes annonces. Ce script tourne à la place du candidat, vingt-quatre heures sur vingt-quatre : il parcourt EmploiCI, Afriwork, LinkedIn et JobnetAfrica, filtre chaque annonce selon le profil et les compétences visées, écarte celles déjà vues, puis compose toutes les six heures un rapport envoyé par email — avec, pour chaque offre, le lien direct pour postuler. Les résultats partent aussi en Excel et en notification Telegram.",
    stack: ['Python', 'Scraping', 'SMTP', 'Telegram Bot API', 'Excel'],
    highlights: [
      'Veille continue sur EmploiCI, Afriwork, LinkedIn et JobnetAfrica',
      'Filtrage par profil, compétences et mots-clés',
      'Rapport email toutes les six heures, lien direct pour postuler',
      'Mémoire des annonces déjà vues : aucun doublon d’un rapport à l’autre',
      'Export Excel et notifications Telegram en parallèle',
    ],
    links: {},
    accent: 'gold',
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

/* ─────────────────────────── PROJETS EN COURS ─────────────────────────── */
export const ongoing = [
  {
    title: 'AgroLink',
    status: 'En développement',
    progress: 40,
    eta: '',
    text: "Super-app agricole tout-en-un pour les producteurs ivoiriens : diagnostic des maladies des cultures par IA depuis une photo, prix du marché en direct, mise en relation producteur-acheteur et alertes météo.",
    stack: ['Flutter', 'Supabase', 'TensorFlow Lite'],
  },
  {
    title: 'Prep AI',
    status: 'Conception',
    progress: 10,
    eta: '',
    text: "Simulateur d'entretien d'embauche. L'IA mène la conversation, pose les questions du poste visé, puis note la prestation et détaille les points à travailler. On s'entraîne autant de fois qu'on veut avant le vrai rendez-vous, sans mobiliser personne.",
    // ⚠️ À COMPLÉTER — indique-moi les technologies retenues
    stack: [],
  },
  {
    title: 'KernSys',
    status: 'En développement',
    progress: 30,
    eta: '',
    text: "ERP agricole qui digitalise toute la chaîne d'une coopérative d'anacarde, de l'achat au producteur jusqu'à l'exportation. Une application mobile pour les pisteurs — collecte hors-ligne, pesée, paiement — et une application web pour la coopérative : stocks, qualité, trésorerie, comptabilité OHADA, ventes et rapports. Un outil clé en main qui remplace Excel et le papier, sécurise les flux financiers et garantit la traçabilité.",
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python', 'PostgreSQL', 'ReportLab'],
  },
]

/* Les deux compteurs de projets se déduisent des listes ci-dessus :
   ils ne peuvent plus se désynchroniser. */
export const stats = [
  { value: 4, suffix: '', label: 'Années à coder' },
  { value: projects.length, suffix: '', label: 'Projets livrés' },
  { value: ongoing.length, suffix: '', label: 'Projets en cours' },
  { value: 100, suffix: '%', label: 'Autodidacte' },
]

export const services = [
  {
    title: 'Applications mobiles',
    text: "Android et iOS avec Flutter : interfaces fluides, fonctionnement hors-ligne pour le terrain, publication sur les stores.",
  },
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

/* ─────────────────────────── ASSISTANTE IA ───────────────────────────
   Le prénom se change ici, il est repris partout. La personnalité, elle,
   se règle dans functions/api/_profil.js */
export const assistant = {
  name: 'Kora',
  role: 'Assistante de Yaya',
  avatar: '/imgs/kora.webp',
  /** Le mot de salutation est ajouté à l'affichage, selon l'heure du visiteur. */
  greeting:
    "je suis Kora, l'assistante d'Ouattara Yaya. Racontez-moi ce que vous voulez construire — et si vous êtes juste de passage, dites-le, je vous fais visiter.",
  // Ce que le visiteur dirait lui-même : il s'adresse à la maison, pas à un tiers.
  suggestions: [
    'Quels sont vos projets phares ?',
    'Vous travaillez avec quelles technologies ?',
    'J’ai un projet, vous pouvez m’aider ?',
    'Comment vous contacter ?',
  ],
  disclaimer:
    'Kora est une IA. Elle répond à partir du contenu de ce site et peut se tromper.',
  placeholder: 'Écrivez votre message…',
  leadConfirm: 'Demande transmise. Nous revenons vers vous.',
}

export const navLinks = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'competences', label: 'Compétences' },
  { id: 'ia', label: 'IA' },
  { id: 'projets', label: 'Projets' },
  { id: 'encours', label: 'En cours' },
  { id: 'contact', label: 'Contact' },
]

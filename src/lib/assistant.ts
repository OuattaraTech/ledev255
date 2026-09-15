/**
 * Protocole des marqueurs d'action.
 *
 * L'assistante peut terminer sa réponse par des marqueurs que le site
 * transforme en boutons. Ils sont retirés du texte affiché.
 */

export type Action =
  | { kind: 'section'; id: string; label: string }
  | { kind: 'project'; id: string; label: string }
  | { kind: 'contact'; label: string }
  | { kind: 'whatsapp'; text: string; label: string }

export type Lead = { nom: string; contact: string; besoin: string }

export type Parsed = {
  text: string
  actions: Action[]
  followups: string[]
  lead?: Lead
}

const MARKER = /\[\[(VOIR|PROJET|CONTACT|WHATSAPP|LEAD|SUIVANT)(?::([^\]]*))?\]\]/g

const SECTION_LABELS: Record<string, string> = {
  accueil: 'Revenir en haut',
  parcours: 'Voir son parcours',
  competences: 'Voir ses compétences',
  ia: 'Voir son usage de l’IA',
  projets: 'Voir ses projets',
  encours: 'Voir ce qu’il construit',
  contact: 'Aller au contact',
}

/**
 * Au-delà de cette part de mots communs, une relance est tenue pour un écho
 * de la question que Kora vient de poser. 0,7 laisse passer les vraies
 * relances, qui partagent au plus quelques mots outils avec sa réponse.
 */
const SEUIL_RECOUVREMENT = 0.7

/** Part des mots d'une relance déjà présents dans la réponse. */
function recouvrement(question: string, corps: string) {
  const mots = question.split(' ').filter(Boolean)
  if (!mots.length) return 0
  const presents = new Set(corps.split(' '))
  return mots.filter((m) => presents.has(m)).length / mots.length
}

/** Forme comparable d'une phrase : sans casse, sans accents, sans ponctuation. */
function normaliser(v: string) {
  return v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Coupe un marqueur encore incomplet en fin de flux, pour qu'il
 * n'apparaisse pas à l'écran pendant la frappe.
 */
function trimPartialMarker(text: string) {
  const open = text.lastIndexOf('[[')
  if (open === -1) return text
  return text.indexOf(']]', open) === -1 ? text.slice(0, open) : text
}

export function parseReply(raw: string, projectTitle: (id: string) => string | null): Parsed {
  const actions: Action[] = []
  const followups: string[] = []
  let lead: Lead | undefined

  let match: RegExpExecArray | null
  MARKER.lastIndex = 0
  while ((match = MARKER.exec(raw))) {
    const [, kind, argRaw = ''] = match
    const arg = argRaw.trim()

    if (kind === 'VOIR' && SECTION_LABELS[arg]) {
      actions.push({ kind: 'section', id: arg, label: SECTION_LABELS[arg] })
    } else if (kind === 'PROJET') {
      const title = projectTitle(arg)
      if (title) actions.push({ kind: 'project', id: arg, label: `Ouvrir ${title}` })
    } else if (kind === 'CONTACT') {
      actions.push({ kind: 'contact', label: 'Écrire à Yaya' })
    } else if (kind === 'WHATSAPP' && arg) {
      actions.push({ kind: 'whatsapp', text: arg, label: 'Ouvrir WhatsApp' })
    } else if (kind === 'SUIVANT' && arg) {
      arg
        .split(';')
        .map((q) => q.trim())
        .filter(Boolean)
        .slice(0, 3)
        .forEach((q) => followups.push(q))
    } else if (kind === 'LEAD' && arg) {
      const [nom = '', contact = '', ...reste] = arg.split(';').map((v) => v.trim())
      if (nom && contact) lead = { nom, contact, besoin: reste.join(' ; ') }
    }
  }

  const text = trimPartialMarker(raw.replace(MARKER, '')).replace(/\n{3,}/g, '\n\n').trim()

  // Une relance n'a de sens que si le visiteur peut la poser. Quand Kora vient
  // de poser la question elle-même, la proposer en bouton revient à la lui
  // renvoyer. On écarte la reprise mot pour mot comme la simple reformulation.
  const corps = normaliser(text)
  const relances = followups.filter((q) => {
    const n = normaliser(q)
    if (n.length <= 2) return false
    if (corps.includes(n)) return false
    return recouvrement(n, corps) < SEUIL_RECOUVREMENT
  })

  return { text, actions: actions.slice(0, 2), followups: relances, lead }
}

/** Événement écouté par la section Projets pour ouvrir une fiche. */
export const OPEN_PROJECT = 'dev225:ouvrir-projet'

export function openProject(id: string) {
  window.dispatchEvent(new CustomEvent(OPEN_PROJECT, { detail: id }))
}

export function goToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const link = document.createElement('a')
  link.href = `#${id}`
  // passe par le gestionnaire de défilement fluide déjà en place
  document.body.appendChild(link)
  link.click()
  link.remove()
}

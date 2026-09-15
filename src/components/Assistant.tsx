import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { assistant, contact, projects } from '../data/content'
import { verrouillerPage } from '../lib/defilement'
import { useReducedMotion } from '../hooks/useMotionPreference'
import {
  goToSection,
  openProject,
  parseReply,
  type Action,
} from '../lib/assistant'

type Msg = { role: 'user' | 'assistant'; raw: string }

const STORE = 'dev225:kora'
const ERRORS: Record<number, string> = {
  429: "Vous avez atteint la limite de messages pour aujourd'hui. Écrivez directement à Yaya, il répond sous 24 h.",
  502: "Je ne peux plus répondre aujourd'hui. Inutile d'insister : écrivez à Yaya, il répond sous 24 h.",
  503: 'Je suis momentanément indisponible. Vous pouvez écrire à Yaya en attendant.',
}

const titleOf = (id: string) => projects.find((p) => p.id === id)?.title ?? null

/** Hauteur maximale de la zone de saisie, en pixels. Doit suivre `max-h-40`. */
const SAISIE_MAX = 160

export default function Assistant() {
  const [available, setAvailable] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [atBottom, setAtBottom] = useState(true)
  const [leadSent, setLeadSent] = useState(false)
  const reduced = useReducedMotion()

  const scroller = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const abort = useRef<AbortController | null>(null)

  /* ── en plein écran, la page derrière ne doit plus bouger ── */

  useEffect(() => {
    // au-delà de 639 px le chat n'est qu'une carte : la page reste
    // librement défilable, et les boutons de section en ont besoin
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return
    verrouillerPage(true)
    return () => verrouillerPage(false)
  }, [open])

  /* ── la zone de saisie épouse le volume du texte ── */

  useLayoutEffect(() => {
    const el = input.current
    if (!el) return
    // remise à zéro d'abord : sans elle scrollHeight ne redescend jamais
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, SAISIE_MAX)}px`
  }, [draft, open])

  /* ── disponibilité et mémoire de session ── */

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/chat', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setAvailable(Boolean(d?.ok)))
      .catch(() => setAvailable(false))
    try {
      const saved = sessionStorage.getItem(STORE)
      if (saved) setMessages(JSON.parse(saved).slice(-20))
    } catch {
      // stockage indisponible : la conversation vivra le temps de la page
    }
    return () => ac.abort()
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-20)))
    } catch {
      /* sans stockage, on continue */
    }
  }, [messages])

  /* ── défilement ── */

  useEffect(() => {
    if (atBottom) {
      bottom.current?.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' })
    }
  }, [messages, busy, atBottom, reduced])

  const onScroll = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 60)
  }, [])

  /* ── clavier ── */

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => input.current?.focus(), 120)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open])

  /* ── actions décidées par l'assistante ── */

  const runAction = useCallback((a: Action) => {
    const narrow = window.matchMedia('(max-width: 639px)').matches
    if (a.kind === 'whatsapp') {
      window.open(`${contact.whatsapp}`, '_blank', 'noopener')
      return
    }
    if (narrow) setOpen(false)
    setTimeout(() => {
      if (a.kind === 'section') goToSection(a.id)
      else if (a.kind === 'project') openProject(a.id)
      else if (a.kind === 'contact') {
        goToSection('contact')
        setTimeout(() => document.getElementById('name')?.focus(), 900)
      }
    }, narrow ? 260 : 0)
  }, [])

  /* ── envoi ── */

  const send = useCallback(
    async (text: string) => {
      const question = text.trim()
      if (!question || busy) return

      setError(null)
      setDraft('')
      setAtBottom(true)
      const next: Msg[] = [...messages, { role: 'user', raw: question }]
      setMessages([...next, { role: 'assistant', raw: '' }])
      setBusy(true)

      const ac = new AbortController()
      abort.current = ac

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          signal: ac.signal,
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.raw })),
          }),
        })

        if (!res.ok || !res.body) {
          setMessages(next)
          setError(
            ERRORS[res.status] ??
              "Ma réponse n'a pas abouti. Si cela se répète, écrivez à Yaya, il répond sous 24 h.",
          )
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let answer = ''

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const payload = line.slice(5).trim()
            if (!payload || payload === '[DONE]') continue
            try {
              const chunk = JSON.parse(payload)
              if (typeof chunk.response === 'string') {
                answer += chunk.response
                setMessages([...next, { role: 'assistant', raw: answer }])
              }
            } catch {
              /* fragment incomplet, complété au tour suivant */
            }
          }
        }

        if (!answer.trim()) {
          setMessages(next)
          setError("Aucune réponse n'est revenue. Réessayez.")
          return
        }

        const parsed = parseReply(answer, titleOf)
        // L'enregistrement se fait dans /api/chat, sur le flux que le serveur
        // diffuse : il n'y a plus rien à envoyer d'ici, seulement à confirmer.
        if (parsed.lead) setLeadSent(true)
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        setMessages(next)
        setError('Connexion interrompue. Vérifiez votre réseau et réessayez.')
      } finally {
        abort.current = null
        setBusy(false)
        input.current?.focus()
      }
    },
    [busy, messages],
  )

  const reset = useCallback(() => {
    abort.current?.abort()
    setMessages([])
    setError(null)
    setLeadSent(false)
    try {
      sessionStorage.removeItem(STORE)
    } catch {
      /* rien à nettoyer */
    }
    input.current?.focus()
  }, [])

  const lastAssistant = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i
    }
    return -1
  }, [messages])

  if (!available) return null

  return (
    <>
      {/* ── Lanceur ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Parler à ${assistant.name}`}
            data-cursor="grow"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="group fixed right-5 z-40 flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-1.5
                       shadow-[0_12px_38px_-10px_rgba(125,85,255,0.85)] sm:right-7 sm:pr-5"
            style={{
              bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
              background: 'linear-gradient(135deg,#ffd98a,#f5c451 28%,#7d55ff)',
            }}
          >
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-void/90">
              <img src={assistant.avatar} alt="" aria-hidden className="h-[38px] w-[38px] rounded-full object-cover" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-void bg-emerald-400" />
              </span>
            </span>
            <span className="hidden text-left font-display text-[13px] font-semibold leading-tight text-void sm:block">
              {assistant.name}
              <span className="block font-sans text-[10px] font-normal opacity-70">
                Posez-moi vos questions
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Voile mobile ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-void/70 backdrop-blur-sm sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Panneau ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`${assistant.name}, ${assistant.role}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="fixed inset-x-0 top-0 h-[100dvh] z-[70] flex flex-col overflow-hidden glass-strong
                       pt-[env(safe-area-inset-top)]
                       shadow-[0_-20px_80px_-30px_rgba(0,0,0,0.95)]
                       sm:inset-auto sm:bottom-0 sm:right-7 sm:h-[min(660px,calc(100dvh-7rem))] sm:w-[400px]
                       sm:rounded-3xl sm:pt-0"
          >
            {/* poignée mobile */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Réduire"
              className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/25 sm:hidden"
            />

            <Header
              onReset={reset}
              onClose={() => setOpen(false)}
              canReset={messages.length > 0}
            />

            {/* ── Conversation ── */}
            <div
              ref={scroller}
              onScroll={onScroll}
              className="relative flex-1 space-y-3.5 overflow-y-auto overscroll-contain px-4 py-4"
            >
              <Bubble role="assistant">{assistant.greeting}</Bubble>

              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <Bubble key={i} role="user">
                    {m.raw}
                  </Bubble>
                ) : (
                  <AssistantTurn
                    key={i}
                    raw={m.raw}
                    isLast={i === lastAssistant}
                    streaming={busy && i === messages.length - 1}
                    onAction={runAction}
                    onFollowup={send}
                  />
                ),
              )}

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {assistant.suggestions.map((q) => (
                    <Chip key={q} onClick={() => send(q)}>
                      {q}
                    </Chip>
                  ))}
                </div>
              )}

              {leadSent && (
                <p className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-200">
                  ✓ {assistant.leadConfirm}
                </p>
              )}

              {error && (
                <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-[12px] leading-relaxed text-red-200">
                  {error}{' '}
                  <a href={`mailto:${contact.email}`} className="underline">
                    {contact.email}
                  </a>
                </p>
              )}

              <div ref={bottom} />
            </div>

            {/* retour en bas */}
            <AnimatePresence>
              {!atBottom && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  onClick={() => {
                    setAtBottom(true)
                    bottom.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
                  }}
                  className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full glass-strong px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-chalk/80"
                >
                  ↓ Derniers messages
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Saisie ── */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
              className="shrink-0 border-t border-line p-3
                         pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={input}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    // Entrée revient à la ligne, comme partout ailleurs.
                    // L'envoi passe par le bouton, ou par Ctrl/⌘ + Entrée.
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault()
                      send(draft)
                    }
                  }}
                  rows={1}
                  maxLength={700}
                  placeholder={assistant.placeholder}
                  className="max-h-40 min-h-[44px] w-full min-w-0 flex-1 resize-none overflow-y-auto rounded-xl border border-line bg-white/[0.04] px-3.5 py-3 text-[16px] leading-snug text-chalk outline-none sm:text-[14px] transition-colors placeholder:text-muted/70 focus:border-gold-400/50"
                />
                {busy ? (
                  <button
                    type="button"
                    onClick={() => abort.current?.abort()}
                    aria-label="Arrêter la réponse"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line text-chalk/80 transition-colors hover:border-gold-400/50"
                  >
                    <span className="h-3 w-3 rounded-[3px] bg-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Envoyer"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-void transition-opacity disabled:opacity-30"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
                      <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.2 15.6 12 3.4 13.8Z" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-2 text-center font-mono text-[9px] leading-relaxed text-muted/70">
                {assistant.disclaimer}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────── sous-composants ─────────────────────────── */

function Header({
  onReset,
  onClose,
  canReset,
}: {
  onReset: () => void
  onClose: () => void
  canReset: boolean
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full">
        <img src={assistant.avatar} alt="" aria-hidden className="h-10 w-10 rounded-full object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[15px] font-semibold text-chalk">
          {assistant.name}
        </p>
        <p className="flex items-center gap-1.5 truncate font-mono text-[10px] uppercase tracking-wider text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {assistant.role}
        </p>
      </div>
      {canReset && (
        <button
          onClick={onReset}
          aria-label="Nouvelle conversation"
          title="Nouvelle conversation"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-chalk/60 transition-colors hover:border-gold-400/50 hover:text-gold-300"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M20 11A8 8 0 1 0 18 16.5" />
            <path d="M20 5v6h-6" />
          </svg>
        </button>
      )}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-chalk/60 transition-colors hover:border-gold-400/50 hover:text-gold-300"
      >
        ✕
      </button>
    </div>
  )
}

function AssistantTurn({
  raw,
  isLast,
  streaming,
  onAction,
  onFollowup,
}: {
  raw: string
  isLast: boolean
  streaming: boolean
  onAction: (a: Action) => void
  onFollowup: (q: string) => void
}) {
  const parsed = useMemo(() => parseReply(raw, titleOf), [raw])

  return (
    <div className="space-y-2">
      <Bubble role="assistant">{parsed.text ? <Rich text={parsed.text} /> : <Typing />}</Bubble>

      {!streaming && parsed.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-9">
          {parsed.actions.map((a, i) => (
            <button
              key={i}
              onClick={() => onAction(a)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1.5 text-[12px] font-medium text-gold-200 transition-colors hover:bg-gold-400/20"
            >
              {a.label}
              <span aria-hidden>→</span>
            </button>
          ))}
        </div>
      )}

      {!streaming && isLast && parsed.followups.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-9">
          {parsed.followups.map((q) => (
            <Chip key={q} onClick={() => onFollowup(q)}>
              {q}
            </Chip>
          ))}
        </div>
      )}
    </div>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const mine = role === 'user'
  if (mine) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[86%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-gradient-to-br from-violet-600 to-violet-700 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white">
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full">
        <img src={assistant.avatar} alt="" aria-hidden className="h-7 w-7 rounded-full object-cover" />
      </span>
      <div className="max-w-[86%] rounded-2xl rounded-bl-sm border border-line bg-white/[0.04] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-chalk/90">
        {children}
      </div>
    </div>
  )
}

/** Rendu léger : gras, retours à la ligne, liens. Aucun HTML injecté. */
function Rich({ text }: { text: string }) {
  const nodes = useMemo(() => {
    const out: React.ReactNode[] = []
    const re = /(\*\*[^*]+\*\*)|(https?:\/\/[^\s)]+)|(\n)/g
    let last = 0
    let m: RegExpExecArray | null
    let k = 0
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index))
      if (m[1]) out.push(<strong key={k++} className="font-semibold text-chalk">{m[1].slice(2, -2)}</strong>)
      else if (m[2])
        out.push(
          <a key={k++} href={m[2]} target="_blank" rel="noreferrer noopener" className="text-gold-300 underline underline-offset-2">
            {m[2].replace(/^https?:\/\//, '')}
          </a>,
        )
      else out.push(<br key={k++} />)
      last = m.index + m[0].length
    }
    if (last < text.length) out.push(text.slice(last))
    return out
  }, [text])

  return <>{nodes}</>
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-left text-[12px] leading-snug text-violet-100 transition-colors hover:border-gold-400/50 hover:text-gold-200"
    >
      {children}
    </button>
  )
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Kora rédige">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-400/80"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}


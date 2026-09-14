import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { assistant, contact, identity } from '../data/content'
import { useReducedMotion } from '../hooks/useMotionPreference'

type Message = { role: 'user' | 'assistant'; content: string }

const ERRORS: Record<number, string> = {
  429: "Vous avez atteint la limite de questions pour aujourd'hui. Écrivez directement à Ouattara, il répond sous 24 h.",
  503: "L'assistant est momentanément indisponible. Vous pouvez écrire à Ouattara en attendant.",
}

export default function Assistant() {
  const [available, setAvailable] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reduced = useReducedMotion()

  const bottom = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  // L'assistant ne s'affiche que si la route serveur répond.
  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/chat', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setAvailable(Boolean(d?.ok)))
      .catch(() => setAvailable(false))
    return () => ac.abort()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    input.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, busy, reduced])

  const send = useCallback(
    async (text: string) => {
      const question = text.trim()
      if (!question || busy) return

      setError(null)
      setDraft('')
      const next: Message[] = [...messages, { role: 'user', content: question }]
      setMessages([...next, { role: 'assistant', content: '' }])
      setBusy(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: next }),
        })

        if (!res.ok || !res.body) {
          setMessages(next)
          setError(ERRORS[res.status] ?? "La réponse n'a pas abouti. Réessayez dans un instant.")
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
                setMessages([...next, { role: 'assistant', content: answer }])
              }
            } catch {
              // fragment incomplet : il sera complété au tour suivant
            }
          }
        }

        if (!answer.trim()) {
          setMessages(next)
          setError("Aucune réponse n'est revenue. Réessayez.")
        }
      } catch {
        setMessages(next)
        setError('Connexion interrompue. Vérifiez votre réseau et réessayez.')
      } finally {
        setBusy(false)
        input.current?.focus()
      }
    },
    [busy, messages],
  )

  if (!available) return null

  return (
    <>
      {/* Lanceur */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Ouvrir ${assistant.name}`}
            data-cursor="grow"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="group fixed right-5 z-40 grid h-14 w-14 place-items-center rounded-full
                       shadow-[0_12px_38px_-10px_rgba(125,85,255,0.85)] sm:right-7 sm:h-[3.75rem] sm:w-[3.75rem]"
            style={{
              bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
              background: 'linear-gradient(135deg,#ffd98a,#f5c451 30%,#7d55ff)',
            }}
          >
            <span className="absolute inset-[2px] rounded-full bg-void/90" />
            <SparkIcon className="relative h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-void bg-emerald-400" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panneau */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="false"
            aria-label={assistant.name}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 top-20 z-[70] flex flex-col overflow-hidden rounded-3xl glass-strong
                       shadow-[0_30px_90px_-30px_rgba(0,0,0,0.95)]
                       sm:inset-x-auto sm:right-7 sm:top-auto sm:h-[min(620px,calc(100dvh-8rem))] sm:w-[390px]"
            style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            {/* En-tête */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <img src={identity.logoMark} alt="" aria-hidden className="h-8 w-auto" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[15px] font-semibold text-chalk">
                  {assistant.name}
                </p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  En ligne
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer l’assistant"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-chalk/70 transition-colors hover:border-gold-400/50 hover:text-gold-300"
              >
                ✕
              </button>
            </div>

            {/* Conversation */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <Bubble role="assistant">{assistant.greeting}</Bubble>

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.content || <Typing />}
                </Bubble>
              ))}

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {assistant.suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-left text-[12px] leading-snug text-violet-100 transition-colors hover:border-gold-400/50 hover:text-gold-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
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

            {/* Saisie */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
              className="border-t border-line p-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={input}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send(draft)
                    }
                  }}
                  rows={1}
                  maxLength={700}
                  placeholder={assistant.placeholder}
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-line bg-white/[0.04] px-3 py-2.5 text-[14px] text-chalk outline-none transition-colors placeholder:text-muted/70 focus:border-gold-400/50"
                />
                <button
                  type="submit"
                  disabled={busy || !draft.trim()}
                  aria-label="Envoyer"
                  className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-void transition-opacity disabled:opacity-35"
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
                    <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.2 15.6 12 3.4 13.8Z" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 font-mono text-[9px] leading-relaxed text-muted/80">
                {assistant.disclaimer}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
          mine
            ? 'rounded-br-sm bg-gradient-to-br from-violet-600 to-violet-700 text-white'
            : 'rounded-bl-sm border border-line bg-white/[0.04] text-chalk/90'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="L’assistant rédige">
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

function SparkIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.6 13.9 9 20.3 10.9 13.9 12.8 12 19.2 10.1 12.8 3.7 10.9 10.1 9Z"
        fill="url(#spark)"
      />
      <path d="M18.4 15.2 19.3 18 22.1 18.9 19.3 19.8 18.4 22.6 17.5 19.8 14.7 18.9 17.5 18Z" fill="#f5c451" />
      <defs>
        <linearGradient id="spark" x1="3" y1="2" x2="20" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe6ad" />
          <stop offset="0.45" stopColor="#f5c451" />
          <stop offset="1" stopColor="#9c7dff" />
        </linearGradient>
      </defs>
    </svg>
  )
}

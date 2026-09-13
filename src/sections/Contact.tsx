import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Magnetic, Reveal, SectionHeading } from '../components/primitives'
import { contact, identity, socials } from '../data/content'

/* Laisse vide pour ouvrir le client mail de l'utilisateur.
   Renseigne une URL Formspree / Web3Forms / Cloudflare Function pour un vrai envoi. */
const FORM_ENDPOINT = ''

type Status = 'idle' | 'sending' | 'sent' | 'error'

function Field({
  label,
  name,
  type = 'text',
  required = true,
  textarea = false,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  textarea?: boolean
  placeholder?: string
}) {
  const base =
    'peer w-full rounded-xl border border-line bg-white/[0.03] px-4 pb-2.5 pt-6 text-[15px] text-chalk placeholder-transparent outline-none transition-colors duration-300 focus:border-gold-400/60'
  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          required={required}
          placeholder={placeholder ?? label}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder ?? label}
          className={base}
        />
      )}
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-wider text-muted transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-gold-400"
      >
        {label}
      </label>
    </div>
  )
}

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const subject = String(data.get('subject') ?? 'Nouveau message')
    const message = String(data.get('message') ?? '')

    if (!FORM_ENDPOINT) {
      const body = `Nom : ${name}\nEmail : ${email}\n\n${message}`
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`
      setStatus('sent')
      setTimeout(() => setStatus('idle'), 4000)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error('bad status')
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 5000)
  }

  return (
    <section id="contact" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(125,85,255,0.14),transparent_66%)] blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Prochaine étape"
          title="Construisons"
          accent="quelque chose"
          align="center"
          description="Une idée de produit, une refonte, une automatisation à mettre en place ? Écris-moi, je réponds sous 24 h."
        />

        <div className="mt-14 grid gap-6 lg:mt-18 lg:grid-cols-[1fr_0.85fr] lg:gap-8">
          {/* Formulaire */}
          <Reveal direction="right">
            <form
              onSubmit={onSubmit}
              className="grad-border rounded-3xl glass-strong p-6 sm:p-8"
              noValidate={false}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Votre nom" name="name" />
                <Field label="Votre email" name="email" type="email" />
              </div>
              <div className="mt-4">
                <Field label="Sujet" name="subject" required={false} />
              </div>
              <div className="mt-4">
                <Field label="Votre message" name="message" textarea />
              </div>

              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
                <Magnetic className="w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary w-full disabled:opacity-60 sm:w-auto"
                  >
                    {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
                    <span aria-hidden>→</span>
                  </button>
                </Magnetic>

                {status === 'sent' && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-[11px] text-emerald-300"
                  >
                    ✓ Message prêt à partir
                  </motion.span>
                )}
                {status === 'error' && (
                  <span className="font-mono text-[11px] text-red-300">
                    ✕ Échec — écris-moi directement par mail
                  </span>
                )}
              </div>

              <p className="mt-4 font-mono text-[10px] leading-relaxed text-muted">
                Pas de spam, pas de revente de données. Juste une réponse humaine.
              </p>
            </form>
          </Reveal>

          {/* Coordonnées */}
          <Reveal direction="left" delay={0.1}>
            <div className="flex h-full flex-col gap-4">
              <div className="grad-border rounded-3xl glass p-6 sm:p-7">
                <span className="eyebrow">Contact direct</span>

                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    Email
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a
                      href={`mailto:${contact.email}`}
                      className="break-all font-display text-base font-medium text-chalk transition-colors hover:text-gold-300 sm:text-lg"
                    >
                      {contact.email}
                    </a>
                    <button
                      onClick={copyEmail}
                      aria-label="Copier l’adresse email"
                      className="shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-gold-400 transition-colors hover:border-gold-400/50"
                      data-cursor="grow"
                    >
                      {copied ? '✓ copié' : 'copier'}
                    </button>
                  </div>
                </div>

                <div className="my-4 hairline" />

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    Téléphone
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-display text-base font-medium text-chalk transition-colors hover:text-gold-300 sm:text-lg"
                    >
                      {contact.phoneDisplay}
                    </a>
                    <a
                      href={contact.whatsapp}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300 transition-colors hover:border-emerald-400/60"
                      data-cursor="grow"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="grad-border rounded-3xl glass p-6 sm:p-7">
                <span className="eyebrow">Réseaux</span>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2.5 rounded-xl border border-line bg-white/[0.02] px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/40"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-600/40 to-gold-400/20 font-mono text-[9px] text-chalk">
                        {s.short}
                      </span>
                      <span className="font-display text-[13px] text-chalk/85">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="grad-border flex-1 rounded-3xl glass p-6 sm:p-7">
                <span className="eyebrow">Où me trouver</span>
                <p className="mt-2 font-display text-base text-chalk">{identity.location}</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300/90">
                    {identity.availability}
                  </span>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-muted">
                  {identity.locationDetail}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

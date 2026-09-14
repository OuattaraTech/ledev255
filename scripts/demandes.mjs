#!/usr/bin/env node
/**
 * Affiche les demandes recueillies par l'assistante.
 *
 *   npm run demandes
 *
 * Lit directement le stockage KV du projet via wrangler : aucune clé
 * à gérer, ton authentification Cloudflare suffit.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8')
const id = toml.match(/binding\s*=\s*"VIEWS"\s*\nid\s*=\s*"([^"]+)"/)?.[1]
if (!id) {
  console.error("Namespace KV introuvable dans wrangler.toml (binding VIEWS).")
  process.exit(1)
}

const wrangler = (args) =>
  execFileSync('npx', ['wrangler', ...args], {
    encoding: 'utf8',
    env: { ...process.env, CI: '1' },
    stdio: ['ignore', 'pipe', 'ignore'],
  })

const keys = JSON.parse(wrangler(['kv', 'key', 'list', '--namespace-id', id, '--prefix', 'lead:']))

if (!keys.length) {
  console.log('Aucune demande pour le moment.')
  process.exit(0)
}

const leads = keys
  .map((k) => {
    try {
      return JSON.parse(wrangler(['kv', 'key', 'get', '--namespace-id', id, k.name]))
    } catch {
      return null
    }
  })
  .filter(Boolean)
  .sort((a, b) => String(b.recu).localeCompare(String(a.recu)))

console.log(`\n${leads.length} demande(s), de la plus récente à la plus ancienne :\n`)
for (const l of leads) {
  const date = new Date(l.recu).toLocaleString('fr-FR')
  console.log(`  ${l.nom}`)
  console.log(`  ${l.contact}${l.pays ? `  ·  ${l.pays}` : ''}`)
  if (l.besoin) console.log(`  ${l.besoin}`)
  console.log(`  ${date}\n`)
}

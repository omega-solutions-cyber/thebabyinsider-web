import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Newsletter capture — Discord logging only.
 *
 * We are NOT subscribing anyone to a mailing list yet. Addresses are posted to
 * a Discord channel so we can see demand and collect the list manually; no ESP
 * is involved and no marketing consent is recorded anywhere.
 *
 * Two consequences that must not drift:
 *   1. The form must not tell people they are subscribed — see NewsletterForm.
 *   2. The privacy policy must not list an ESP as a processor while this is the
 *      implementation.
 *
 * When a real ESP is wired up, replace `notifyDiscord` with the provider call,
 * turn on double opt-in, and update both of the above.
 */

const schema = z.object({
  email: z.string().email().max(254),
  /** Honeypot — real users never fill this. */
  company: z.string().optional(),
  /** Milliseconds between form mount and submit. */
  elapsedMs: z.number().optional(),
  source: z.string().max(64).default('unknown'),
  categoryInterest: z.string().max(64).optional(),
  path: z.string().max(256).optional(),
})

/**
 * In-memory sliding window. Adequate at launch traffic and adds no
 * infrastructure; swap for Upstash if this runs on more than one instance under
 * real load.
 */
const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }

  return recent.length > MAX_PER_WINDOW
}

const fail = (message: string, status = 400) =>
  NextResponse.json({ ok: false, message }, { status })

async function notifyDiscord(payload: {
  email: string
  source: string
  categoryInterest?: string
  path?: string
}) {
  const webhook = process.env.DISCORD_NEWSLETTER_WEBHOOK_URL
  if (!webhook) throw new Error('DISCORD_NEWSLETTER_WEBHOOK_URL is not configured')

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      content: [
        '📬 **NEW NEWSLETTER SIGNUP** — The Baby Insider',
        '',
        `email: ${payload.email}`,
        `source: ${payload.source}`,
        payload.categoryInterest ? `category: ${payload.categoryInterest}` : null,
        payload.path ? `page: ${payload.path}` : null,
      ]
        // Only drop omitted fields — a deliberate blank line must survive,
        // which `filter(Boolean)` would strip.
        .filter((line) => line !== null)
        .join('\n'),
      // Nothing in this message should ever ping a role or @everyone.
      allowed_mentions: { parse: [] },
    }),
  })

  if (!res.ok) {
    throw new Error(`Discord webhook returned ${res.status}: ${await res.text()}`)
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (rateLimited(ip)) {
    return fail('Too many attempts. Please wait a moment and try again.', 429)
  }

  let parsed: z.infer<typeof schema>
  try {
    parsed = schema.parse(await request.json())
  } catch {
    return fail('Please enter a valid email address.')
  }

  // Bot signals. Both return a success shape so scrapers learn nothing about
  // which check caught them.
  if (parsed.company) return NextResponse.json({ ok: true })
  if (parsed.elapsedMs != null && parsed.elapsedMs < 2000) return NextResponse.json({ ok: true })

  try {
    await notifyDiscord({
      email: parsed.email,
      source: parsed.source,
      categoryInterest: parsed.categoryInterest,
      path: parsed.path,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    // If we could not record the address, say so — silently dropping it would
    // leave the reader believing they had signed up.
    console.error('[newsletter] failed to record signup', error)
    return fail('We could not record your email. Please try again shortly.', 502)
  }
}

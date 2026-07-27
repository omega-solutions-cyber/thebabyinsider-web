import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const KLAVIYO_REVISION = '2025-01-15'

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
 * infrastructure; swap for Upstash if this ever runs on more than one instance
 * under real load.
 */
const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }

  return recent.length > MAX_PER_WINDOW
}

const fail = (message: string, status = 400) =>
  NextResponse.json({ ok: false, message }, { status })

export async function POST(request: Request) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) {
    console.error('[newsletter] KLAVIYO_PRIVATE_API_KEY or KLAVIYO_LIST_ID is not configured')
    return fail('Newsletter signup is temporarily unavailable.', 503)
  }

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

  // Bot signals. Both respond with a success shape so scrapers learn nothing
  // about which check caught them.
  if (parsed.company) return NextResponse.json({ ok: true })
  if (parsed.elapsedMs != null && parsed.elapsedMs < 2000) return NextResponse.json({ ok: true })

  try {
    const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: KLAVIYO_REVISION,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email: parsed.email,
                    // Attribution for which placements and articles convert.
                    properties: {
                      site: 'the-baby-insider',
                      signup_source: parsed.source,
                      first_article: parsed.path,
                      category_interest: parsed.categoryInterest,
                    },
                    subscriptions: {
                      email: { marketing: { consent: 'SUBSCRIBED' } },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: { data: { type: 'list', id: listId } },
          },
        },
      }),
    })

    if (!res.ok) {
      // Never surface Klaviyo's response body to the client.
      console.error('[newsletter] Klaviyo error', res.status, await res.text())
      return fail('We could not complete your signup. Please try again shortly.', 502)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[newsletter] request failed', error)
    return fail('We could not complete your signup. Please try again shortly.', 502)
  }
}

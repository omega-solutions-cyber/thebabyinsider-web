import { NextResponse, type NextRequest } from 'next/server'
import { experiment, type Variant } from '@/data/experiment'

const isVariant = (v: string | null | undefined): v is Variant =>
  (experiment.variants as readonly string[]).includes(v ?? '')

/**
 * Splits the paid landing URL between control and the listicle. Order: a
 * ?variant= QA override, then a forced arm when the test is ended (share 0 or
 * 1), then the visitor's cookie, then a fresh random draw. A browser that
 * refuses the cookie just gets a fresh draw per visit.
 */
export function proxy(req: NextRequest) {
  const share = experiment.listicleShare
  const override = req.nextUrl.searchParams.get('variant')
  const saved = req.cookies.get(experiment.cookie)?.value

  const variant: Variant = isVariant(override)
    ? override
    : share <= 0
      ? 'control'
      : share >= 1
        ? 'listicle'
        : isVariant(saved)
          ? saved
          : Math.random() < share
            ? 'listicle'
            : 'control'

  const res =
    variant === 'listicle'
      ? NextResponse.rewrite(new URL(experiment.variantPath, req.url))
      : NextResponse.next()
  if (variant !== saved) {
    // Readable by GoogleTag on the client, so not httpOnly.
    res.cookies.set(experiment.cookie, variant, {
      path: '/',
      sameSite: 'lax',
      maxAge: experiment.cookieDays * 86400,
    })
  }
  return res
}

export const config = { matcher: '/gear/best-baby-milestone-apps' }

/**
 * All dates render in UTC so prerendered output is deterministic and can never
 * disagree with what a client would compute.
 */
const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const dateFmtShort = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export const formatDate = (iso: string) => dateFmt.format(new Date(iso))
export const formatDateShort = (iso: string) => dateFmtShort.format(new Date(iso))

/** Machine-readable date for <time datetime> and JSON-LD. */
export const isoDate = (iso: string) => new Date(iso).toISOString()

/**
 * View counts are rounded so that day-to-day staleness in the nightly metrics
 * sync is invisible.
 */
export function formatCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  if (n < 1_000_000) return `${Math.round(n / 1000)}K`
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

export const readingTimeLabel = (minutes: number) => `${Math.max(1, Math.round(minutes))} min read`

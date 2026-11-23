/**
 * On-site A/B test for the paid landing page. proxy.ts assigns each visitor to
 * an arm and remembers it in a cookie; GoogleTag tags every event with it.
 *
 * Change the split: edit `listicleShare` (0.5 = 50/50). Visitors who already
 * have a cookie keep their arm.
 * End the test: set `listicleShare` to 0 (everyone sees control) or 1
 * (everyone sees the listicle). Cookies are then overridden, so no one is stuck.
 */
export const experiment = {
  name: 'milestone_lp',
  cookie: 'bi_ab_milestone_lp',
  /** The URL the ads already use; served as-is to control. */
  path: '/gear/best-baby-milestone-apps',
  /** Rewritten to for the listicle arm; the browser URL does not change. */
  variantPath: '/picks/best-baby-milestone-apps',
  variants: ['control', 'listicle'] as const,
  listicleShare: 0.5,
  cookieDays: 90,
}

export type Variant = (typeof experiment.variants)[number]

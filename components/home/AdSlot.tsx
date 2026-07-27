import { cn } from '@/lib/cn'

/**
 * Reserved advertising space.
 *
 * The box and its label render whether or not an ad ever fills it. Unreserved
 * ad space is the single largest source of layout shift on magazine sites, so
 * the height is committed server-side and never changes.
 */
export function AdSlot({
  size = 'leaderboard',
  className,
}: {
  size?: 'leaderboard' | 'rectangle'
  className?: string
}) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn('flex flex-col items-center justify-start py-6', className)}
    >
      <span className="text-ink-faint text-[0.65rem] tracking-[0.08em] uppercase">
        Advertisement
      </span>
      <div
        className={cn(
          'bg-surface rounded-card mt-2 w-full',
          size === 'leaderboard' ? 'h-[90px] max-w-[728px]' : 'h-[250px] max-w-[300px]'
        )}
      />
    </aside>
  )
}

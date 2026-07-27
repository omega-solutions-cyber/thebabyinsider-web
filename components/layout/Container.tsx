import type { ReactNode, ElementType } from 'react'
import { cn } from '@/lib/cn'

/**
 * The single source of layout truth. Every full-width band on the site puts its
 * background outside a Container and its content inside one, so gutters and max
 * width never drift between sections.
 */
export function Container({
  as: Tag = 'div',
  className,
  children,
  width = 'default',
}: {
  as?: ElementType
  className?: string
  children: ReactNode
  width?: 'default' | 'wide' | 'prose'
}) {
  return (
    <Tag
      className={cn(
        'px-gutter mx-auto w-full',
        width === 'default' && 'max-w-[1100px]',
        width === 'wide' && 'max-w-[1400px]',
        width === 'prose' && 'max-w-[720px]',
        className
      )}
    >
      {children}
    </Tag>
  )
}

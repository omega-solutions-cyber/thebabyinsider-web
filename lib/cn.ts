type ClassValue = string | number | false | null | undefined | ClassValue[]

/**
 * Minimal class joiner. Deliberately not clsx + tailwind-merge — nothing here
 * needs conflict resolution, and this keeps the client bundle smaller.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  for (const i of inputs) {
    if (!i) continue
    if (Array.isArray(i)) {
      const nested = cn(...i)
      if (nested) out.push(nested)
    } else {
      out.push(String(i))
    }
  }
  return out.join(' ')
}

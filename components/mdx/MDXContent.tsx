import * as runtime from 'react/jsx-runtime'
import type { ComponentType, ReactNode } from 'react'
import { mdxComponents } from './mdxComponents'

/**
 * Velite compiles MDX to a function-body *string* rather than a component, so
 * rendering it takes this small shim. It runs on the server during RSC render,
 * so the client never receives the evaluated function — only serialised HTML.
 *
 * `code` comes from our own content directory at build time. It is not user
 * input, and there is no path by which untrusted content reaches this.
 */
function useMDXComponent(code: string): ComponentType<{ components?: MDXComponents }> {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

// MDX components legitimately have heterogeneous prop shapes, so this map is
// intentionally loose. Each component still type-checks at its definition.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MDXComponents = Record<string, ComponentType<any>>

interface MDXContentProps {
  code: string
  /** Extra components on top of the shared map — e.g. article-scoped blocks. */
  components?: MDXComponents
}

export function MDXContent({ code, components }: MDXContentProps): ReactNode {
  const Component = useMDXComponent(code)
  return <Component components={{ ...mdxComponents, ...components }} />
}

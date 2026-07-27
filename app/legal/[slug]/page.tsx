import type { Metadata } from 'next'
import { MdxPageView, mdxPageMetadata } from '@/components/pages/MdxPageView'
import { pages } from '@/lib/content'

export const dynamicParams = false

export function generateStaticParams() {
  return pages
    .filter((p) => p.path.startsWith('legal/'))
    .map((p) => ({ slug: p.path.replace(/^legal\//, '') }))
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  return mdxPageMetadata(`legal/${slug}`)
}

export default async function LegalPage({ params }: { params: Params }) {
  const { slug } = await params
  return <MdxPageView path={`legal/${slug}`} parent={{ name: 'Legal', url: '/legal/terms' }} />
}

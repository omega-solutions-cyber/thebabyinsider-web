import { MdxPageView, mdxPageMetadata } from '@/components/pages/MdxPageView'

export const metadata = mdxPageMetadata('about')

export default function Page() {
  return <MdxPageView path="about" />
}

/**
 * Single source of truth for site-wide identity, SEO defaults and the
 * ownership relationship that every disclosure surface reads from.
 */

export const siteConfig = {
  name: 'The Baby Insider',
  shortName: 'Baby Insider',
  tagline: 'Evidence-based answers for the first five years',
  description:
    'Practical, doctor-reviewed guidance on pregnancy, newborn care, sleep, feeding and baby milestones — plus honest reviews of the products and apps parents actually use.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thebabyinsider.com',
  locale: 'en_US',
  language: 'en',
  founded: '2026',

  email: 'hello@thebabyinsider.com',
  editorialEmail: 'editorial@thebabyinsider.com',

  social: {
    facebook: 'https://www.facebook.com/thebabyinsider',
    x: 'https://x.com/thebabyinsider',
    pinterest: 'https://www.pinterest.com/thebabyinsider',
    instagram: 'https://www.instagram.com/thebabyinsider',
    youtube: 'https://www.youtube.com/@thebabyinsider',
  },

  /**
   * The ownership relationship, stated once here and consumed by the About page,
   * the OwnershipDisclosure component, the BabyLeapPromo block and the
   * Organization JSON-LD (`parentOrganization`). Changing it changes every
   * disclosure surface at once — that is the point.
   */
  ownership: {
    parentName: 'Omega Solutions',
    productName: 'BabyLeap',
    productUrl: 'https://www.babyleapapp.com',
  },

  /** Shown in the thin bar above every page. */
  disclosureBar: {
    text: 'Commissions may be earned on purchases made through links.',
    linkText: 'Learn More',
    href: '/advertising-disclosure',
  },

  newsletter: {
    heading: 'NEWSLETTER',
    blurb:
      'Subscribe to our parenting newsletter for weekly, doctor-reviewed guidance on sleep, feeding and development — plus honest product picks.',
    placeholder: 'Enter your email',
    cta: 'Subscribe',
  },

  /** Footer "The Baby Insider" column — the trust pages. */
  footerBrandLinks: [
    { title: 'Contact Us', href: '/contact' },
    { title: 'Medical Review Team', href: '/medical-review-team' },
    { title: 'Editorial Process', href: '/editorial-process' },
    { title: 'How We Evaluate Brands', href: '/how-we-evaluate' },
    { title: 'Advertising Disclosure', href: '/advertising-disclosure' },
    { title: 'About Us', href: '/about' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Cookie Policy', href: '/legal/cookie-policy' },
  ],

  /** Articles per page on category / tag / author archives. */
  pageSize: 12,
} as const

export type SiteConfig = typeof siteConfig

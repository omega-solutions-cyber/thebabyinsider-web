import Script from 'next/script'
import { siteConfig } from '@/data/siteConfig'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

const { appStoreUrl, playStoreUrl } = siteConfig.ownership

/**
 * gtag.js for GA4 + Google Ads. Configuring an AW- id makes gtag write the
 * _gcl_* cookies itself, which is what GTM's Conversion Linker tag does.
 *
 * Outbound clicks are caught by one delegated listener, so links rendered from
 * MDX, AppDownload, product cards etc. are all covered without per-link wiring.
 * Clicks to our own store listings also send `app_store_click`, which is marked
 * as a GA4 key event and imported into Google Ads, like the funnel's events.
 *
 * shortcut: no consent gating (CookiePreferences is not wired to anything); add
 * Consent Mode v2 defaults before running traffic from the EU/UK.
 */
export function GoogleTag() {
  const primaryId = GA_ID ?? ADS_ID
  if (!primaryId) return null

  const ids = [GA_ID, ADS_ID].filter(Boolean)
  const ownStoreUrls = [appStoreUrl, playStoreUrl].filter(Boolean)

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${ids.map((id) => `gtag('config', ${JSON.stringify(id)});`).join('\n')}

var ownStore = ${JSON.stringify(ownStoreUrls)};
document.addEventListener('click', function (e) {
  var a = e.target instanceof Element && e.target.closest('a[href]');
  if (!a || a.host === location.host || !/^https?:$/.test(a.protocol)) return;
  var isOwnApp = ownStore.indexOf(a.href) !== -1;
  gtag('event', 'outbound_click', {
    link_url: a.href,
    link_domain: a.hostname,
    link_text: (a.textContent || '').trim().slice(0, 100),
    own_app: isOwnApp,
  });
  if (isOwnApp) gtag('event', 'app_store_click', { link_url: a.href, store: a.hostname });
}, true);
`}
      </Script>
    </>
  )
}

import Script from 'next/script'
import { siteConfig } from '@/data/siteConfig'
import { experiment } from '@/data/experiment'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

const funnelHost = new URL(siteConfig.ownership.funnelUrl).hostname

/**
 * gtag.js for GA4 + Google Ads. Configuring an AW- id makes gtag write the
 * _gcl_* cookies itself, which is what GTM's Conversion Linker tag does.
 *
 * Outbound clicks are caught by one delegated listener, so links rendered from
 * MDX, AppDownload, product cards etc. are all covered without per-link wiring.
 * Clicks into the BabyLeap web funnel also send `funnel_click`, which is marked
 * as a GA4 key event and imported into Google Ads, like the funnel's events.
 * The linker carries the GA client id and gclid across to the funnel domain so
 * funnel purchases attribute back to the ad that brought the reader here.
 *
 * shortcut: no consent gating (CookiePreferences is not wired to anything); add
 * Consent Mode v2 defaults before running traffic from the EU/UK.
 *
 * A/B arm: if proxy.ts has put the visitor in an experiment, the arm is set as
 * an event param and user property before config, so page_view and every later
 * event carry it, and it is appended to funnel links as ab_variant so the
 * funnel can attach it to checkout and purchase.
 */
export function GoogleTag() {
  const primaryId = GA_ID ?? ADS_ID
  if (!primaryId) return null

  const ids = [GA_ID, ADS_ID].filter(Boolean)

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
gtag('set', 'linker', { domains: [${JSON.stringify(funnelHost)}] });
var abMatch = document.cookie.match(/(?:^|; )${experiment.cookie}=([a-z_]+)/);
var ab = abMatch ? ${JSON.stringify(experiment.name)} + ':' + abMatch[1] : null;
if (ab) {
  gtag('set', { ab_variant: ab });
  gtag('set', 'user_properties', { ab_variant: ab });
}
${ids.map((id) => `gtag('config', ${JSON.stringify(id)});`).join('\n')}

var funnelHost = ${JSON.stringify(funnelHost)};
document.addEventListener('click', function (e) {
  var a = e.target instanceof Element && e.target.closest('a[href]');
  if (!a || a.host === location.host || !/^https?:$/.test(a.protocol)) return;
  var isFunnel = a.hostname === funnelHost || a.hostname === 'www.' + funnelHost;
  // data-cta-location tells placements apart (e.g. the sticky bar vs in-article blocks).
  var loc = a.getAttribute('data-cta-location') || 'in_content';
  gtag('event', 'outbound_click', {
    link_url: a.href,
    link_domain: a.hostname,
    link_text: (a.textContent || '').trim().slice(0, 100),
    funnel: isFunnel,
    cta_location: loc,
  });
  if (isFunnel && ab) {
    var u = new URL(a.href);
    u.searchParams.set('ab_variant', ab);
    a.href = u.toString();
  }
  if (isFunnel) gtag('event', 'funnel_click', { link_url: a.href, cta_location: loc });
}, true);
`}
      </Script>
    </>
  )
}

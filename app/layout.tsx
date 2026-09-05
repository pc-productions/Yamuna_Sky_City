import type { Metadata } from "next";
import { Inter, Poppins, Cormorant_Garamond } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { analytics, isSiteUrlConfigured, seo } from "@/content/site";
import { buildSiteStructuredData } from "@/lib/structuredData";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

// Brand typography: Poppins (headings), Inter (body/UI), and Cormorant Garamond (editorial serif)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.homeTitle,
    template: seo.titleTemplate,
  },
  description: seo.description,
  // Canonical URLs are declared per page (app/page.tsx, legal pages) —
  // a root-level canonical would be inherited by every route.
  applicationName: seo.titleDefault,
  openGraph: {
    title: seo.homeTitle,
    description: seo.description,
    url: seo.siteUrl,
    siteName: seo.titleDefault,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.homeTitle,
    description: seo.description,
    // Only emitted once a confirmed handle exists in content/site.ts.
    ...(seo.twitterHandle ? { site: seo.twitterHandle } : {}),
  },
  // Mirrors app/robots.ts: indexable only once the real domain is set.
  robots: {
    index: isSiteUrlConfigured,
    follow: isSiteUrlConfigured,
  },
  ...(seo.googleSiteVerification
    ? { verification: { google: seo.googleSiteVerification } }
    : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      {/* Google Tag Manager (content/site.ts → analytics.gtmId). Next's
          official component injects the dataLayer bootstrap and loads
          gtm.js after hydration — the App Router equivalent of "as high
          in the head as possible" without blocking first paint. */}
      {analytics.gtmId && <GoogleTagManager gtmId={analytics.gtmId} />}
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {/* GTM noscript fallback — the doc's step 2, immediately after
            the opening body tag, so tags still fire with JS disabled. */}
        {analytics.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${analytics.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        {/* Purely factual structured data (Organization + WebSite, see
            lib/structuredData.ts); emitted only once the real domain is
            configured so search engines never receive placeholder URLs. */}
        {isSiteUrlConfigured && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildSiteStructuredData()),
            }}
          />
        )}
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

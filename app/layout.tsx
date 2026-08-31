import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { seo } from "@/content/site";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

// Brand typography: Poppins (headings — Medium/Semibold only) and
// Inter (body/UI — Regular/Medium). No other weights are loaded.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.titleDefault,
    template: seo.titleTemplate,
  },
  description: seo.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seo.titleDefault,
    description: seo.description,
    url: seo.siteUrl,
    siteName: seo.titleDefault,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.titleDefault,
    description: seo.description,
    // Only emitted once a confirmed handle exists in content/site.ts.
    ...(seo.twitterHandle ? { site: seo.twitterHandle } : {}),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

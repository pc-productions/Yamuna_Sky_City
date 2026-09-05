import { brochure } from "@/content/site";
import type { SubmitResult } from "@/lib/actions/submitEnquiry";

/**
 * Brochure access — resolved ONLY from a confirmed successful submission.
 *
 * The final delivery mechanism is not decided yet. This resolver is the
 * single replaceable point where it will be chosen:
 *   A. Website-hosted brochure  → `brochure.href` in content/site.ts
 *   B. CRM returns a brochure URL → `result.brochureUrl` (from the CRM
 *      boundary's response mapping)
 *   C. Website backend gates access → return a controlled URL here
 * Precedence today: a CRM-provided URL wins, then the site-hosted file.
 * With neither configured the result is `available: false` and the UI
 * shows the honest "we'll share it shortly" copy — never a dead link.
 */
export type BrochureAccess =
  | { available: true; href: string; external: boolean }
  | { available: false };

export function resolveBrochureAccess(result: SubmitResult | null): BrochureAccess {
  if (!result || !result.ok) return { available: false };
  const href = result.brochureUrl?.trim() || brochure.href.trim();
  if (!href) return { available: false };
  return { available: true, href, external: /^https?:\/\//.test(href) };
}

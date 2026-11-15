import { getVisitorCount } from "@/lib/visitor-count";
import { VisitorCounterOdometer } from "@/components/landing/visitor-counter-odometer";

/* Server-fetched so the count ships in the HTML behind a Suspense boundary
   instead of arriving late from a client-side request. */
export async function VisitorCounter() {
  const visitors = await getVisitorCount();
  // A fresh site has no history to show; hide the pill rather than paint a 0.
  if (visitors === null || visitors === 0) return null;
  return <VisitorCounterOdometer visitors={visitors} />;
}

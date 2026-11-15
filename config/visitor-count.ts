/**
 * Visitor totals are reconciled against the analytics service configured in
 * `TALVESS_STATS_KEY` / `TALVESS_ORIGIN`.
 *
 * `baseline` is the historical total to display before any live data arrives.
 * `talvessBaseline` is the lifetime count the analytics service reported when
 * the snapshot was taken, so only growth above it is added. That stops old
 * traffic being counted twice.
 *
 * This site starts from zero: keep both totals equal and update them together
 * after any reconciliation.
 */
export const visitorCountConfig = {
  baseline: 0,
  talvessBaseline: 0,
  recordedAt: "2026-11-15T00:00:00.000Z",
} as const;

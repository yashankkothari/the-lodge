"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="micro-transition inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground"
    >
      {label}
    </button>
  );
}

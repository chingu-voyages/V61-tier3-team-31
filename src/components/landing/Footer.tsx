import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="border-t border-border text-center text-muted-foreground text-sm">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex items-center justify-center sm:justify-between gap-4 flex-wrap">
        <div className="flex justify-center items-center gap-1">
          <Logo className="size-6 shrink-0" />
          Cohorix © 2026
        </div>
        <div>
          View source on
          <a
            href={"https://github.com/chingu-voyages/V61-tier3-team-31"}
            target="_blank"
            className="text-primary ml-1 hover:underline hover:underline-offset-4"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

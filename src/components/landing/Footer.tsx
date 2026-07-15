import { Sparkle, Sparkles } from "lucide-react";
import { Logo } from "../Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border p-6 text-center text-muted-foreground text-sm space-y-3">
      <div className="max-w-6xl mx-auto flex justify-center sm:justify-between gap-4 flex-wrap">
        <div className="flex justify-center items-center gap-1">
          <Logo className="size-6 shrink-0" />
          Cohorix © 2026
        </div>
        <div>
          View source on
          <Link
            href={"https://github.com/chingu-voyages/V61-tier3-team-31"}
            target="_blank"
            className="text-primary ml-1 hover:underline hover:underline-offset-4"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}

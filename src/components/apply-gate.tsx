"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const APPLY_PATH = "/app/apply";

export function ApplyGate({
  needsApply,
  children,
}: {
  needsApply: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (needsApply && pathname !== APPLY_PATH) {
      router.replace(APPLY_PATH);
    }
  }, [needsApply, pathname, router]);

  if (needsApply && pathname !== APPLY_PATH) {
    return null;
  }

  return children;
}

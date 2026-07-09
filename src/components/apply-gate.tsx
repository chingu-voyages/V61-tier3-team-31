"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const APPLY_PATH = "/app/apply";

export function ApplyGate({
  hasSubmittedApplication,
  children,
}: {
  hasSubmittedApplication: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasSubmittedApplication && pathname !== APPLY_PATH) {
      router.replace(APPLY_PATH);
    }
  }, [hasSubmittedApplication, pathname, router]);

  if (!hasSubmittedApplication && pathname !== APPLY_PATH) {
    return null;
  }

  return children;
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProfileSyncDiff } from "@/lib/applications/profile-sync";

export function ProfileSyncDialog({
  open,
  differences,
  isLoading,
  error,
  onConfirm,
  onSkip,
}: {
  open: boolean;
  differences: ProfileSyncDiff[];
  isLoading: boolean;
  error?: string;
  onConfirm: () => void | Promise<void>;
  onSkip: () => void | Promise<void>;
}) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your profile too?</DialogTitle>
          <DialogDescription>
            Your application has been submitted. We can also update your reusable profile with the
            new information from this course application.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Profile stores your current reusable info. Application stores this course&apos;s
            submitted snapshot.
          </div>

          <div className="space-y-3">
            {differences.map((difference) => (
              <div
                key={difference.field}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-sm font-semibold text-white">{difference.label}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Current profile:{" "}
                  <span className="text-slate-200">{difference.profileValue || "Empty"}</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  This application:{" "}
                  <span className="text-nexus-green">{difference.applicationValue || "Empty"}</span>
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onSkip} disabled={isLoading}>
            Keep profile as is
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Updating profile..." : "Update profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

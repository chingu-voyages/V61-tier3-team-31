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
          <div className="rounded-2xl border border-border bg-muted p-4 text-sm text-muted-foreground">
            Profile stores your current reusable info. Application stores this course&apos;s
            submitted snapshot.
          </div>

          <div className="space-y-3">
            {differences.map((difference) => (
              <div
                key={difference.field}
                className="rounded-2xl border border-border bg-muted/50 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{difference.label}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Current profile:{" "}
                  <span className="text-foreground">{difference.profileValue || "Empty"}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This application:{" "}
                  <span className="text-nexus-green">{difference.applicationValue || "Empty"}</span>
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive-foreground">
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

"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

/**
 * Haupt-Container fuer einen Dialog.
 * Verwaltet den Offen-/Geschlossen-Zustand des Modals.
 */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Portal-Komponente fuer das Rendern ausserhalb des Eltern-DOM.
 */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Ausloeser-Element, das den Dialog oeffnet.
 */
function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Hintergrund-Overlay fuer den Dialog.
 * Verduenstlicht den Hintergrund und verhindert Interaktionen.
 */
function DialogBackdrop({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Popup-Fenster des Dialogs.
 * Zentriert das Modal auf dem Bildschirm mit Animation.
 */
function DialogPopup({
  className,
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogBackdrop />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <DialogPrimitive.Popup
          data-slot="dialog-popup"
          className={cn(
            "w-full max-w-lg origin-center pointer-events-auto rounded-2xl bg-white dark:bg-[#1a1b24] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-0 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  )
}

/**
 * Ueberschrift des Dialogs.
 */
function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-outfit font-semibold text-slate-900 dark:text-white",
        className
      )}
      {...props}
    />
  )
}

/**
 * Optionale Beschreibung unterhalb der Ueberschrift.
 */
function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-slate-500 dark:text-slate-400",
        className
      )}
      {...props}
    />
  )
}

/**
 * Schliessen-Button fuer den Dialog.
 */
function DialogClose({
  className,
  ...props
}: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(
        "absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogPortal,
  DialogTrigger,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
}

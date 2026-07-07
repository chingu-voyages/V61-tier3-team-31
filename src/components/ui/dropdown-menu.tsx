"use client";

import { useState, useRef, useEffect, createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
  triggerRef: { current: null },
});

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!triggerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen, setIsOpen, triggerRef } = useContext(DropdownMenuContext);
  return (
    <button ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className={className}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  className = "",
}: {
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}) {
  const { isOpen, triggerRef } = useContext(DropdownMenuContext);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = rect.bottom + sideOffset;
      let left = rect.left;
      if (side === "top") top = rect.top - sideOffset - (contentRef.current?.offsetHeight || 0);
      if (align === "end") left = rect.right - (contentRef.current?.offsetWidth || 0);
      setPos({ top, left });
    }
  }, [isOpen, side, align, sideOffset, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={`fixed z-50 min-w-[180px] bg-[#1a1b24] border border-white/10 text-slate-200 p-1 shadow-xl rounded-lg ${className}`}
      style={{ top: pos.top, left: pos.left }}
    >
      {children}
    </div>,
    document.body,
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const { setIsOpen } = useContext(DropdownMenuContext);
  return (
    <button
      onClick={() => {
        onClick?.();
        setIsOpen(false);
      }}
      className={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer hover:bg-white/5 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className = "" }: { className?: string }) {
  return <div className={`h-px bg-white/10 my-1 ${className}`} />;
}

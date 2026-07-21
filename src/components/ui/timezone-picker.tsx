"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Search, X, Check } from "lucide-react";
import { findTimezonesByAlias } from "@/lib/timezone-aliases";

interface TimezonePickerProps {
  value: string;
  onChange: (tz: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

function getUtcOffsetMinutes(tz: string): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(now);
  const tzPart = parts.find((p) => p.type === "timeZoneName");
  if (!tzPart) return 0;
  const val = tzPart.value;
  if (val === "UTC") return 0;
  const match = val.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours * 60 + minutes);
}

function formatOffset(minutes: number): string {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const sign = minutes < 0 ? "\u2212" : minutes > 0 ? "+" : "\u00b1";
  if (m === 0) return `UTC${sign}${h}`;
  return `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
}

const CONTINENT_LABELS: Record<string, string> = {
  Africa: "Africa",
  America: "America",
  Asia: "Asia",
  Atlantic: "Atlantic",
  Australia: "Australia",
  Europe: "Europe",
  Pacific: "Pacific",
  Indian: "Indian Ocean",
  Etc: "Other",
};

type TzData = {
  value: string;
  group: string;
  offsetStr: string;
  offsetMinutes: number;
  isDetected: boolean;
};

const TIMEZONE_DATA: TzData[] = Intl.supportedValuesOf("timeZone").map((tz) => {
  const group = tz.split("/")[0];
  const offset = getUtcOffsetMinutes(tz);
  return {
    value: tz,
    group,
    offsetStr: formatOffset(offset),
    offsetMinutes: offset,
    isDetected: tz === Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
});

const GROUPED_TIMEZONES: Record<string, TzData[]> = TIMEZONE_DATA.reduce(
  (acc, tz) => {
    if (!acc[tz.group]) acc[tz.group] = [];
    acc[tz.group].push(tz);
    return acc;
  },
  {} as Record<string, TzData[]>,
);

interface FlatItem extends TzData {
  groupLabel: string;
  idx: number;
}

export function TimezonePicker({
  value,
  onChange,
  error,
  label = "Timezone",
  required = false,
}: TimezonePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return GROUPED_TIMEZONES;
    const q = search.toLowerCase();
    const aliasMatches = new Set(findTimezonesByAlias(search));
    const result: Record<string, TzData[]> = {};
    for (const [group, tzs] of Object.entries(GROUPED_TIMEZONES)) {
      const matches = tzs.filter(
        (tz) =>
          aliasMatches.has(tz.value) ||
          tz.value.toLowerCase().includes(q) ||
          tz.offsetStr.toLowerCase().includes(q) ||
          tz.value.split("/").slice(1).join("/").replace(/_/g, " ").toLowerCase().includes(q),
      );
      if (matches.length > 0) result[group] = matches;
    }
    return result;
  }, [search]);

  const flatFiltered: FlatItem[] = useMemo(() => {
    let runningIndex = -1;
    return Object.entries(filteredGroups).flatMap(([group, tzs]) =>
      tzs.map((tz) => {
        runningIndex++;
        return { ...tz, groupLabel: CONTINENT_LABELS[group] || group, idx: runningIndex };
      }),
    );
  }, [filteredGroups]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSearch("");
    setHighlightIndex(-1);
    requestAnimationFrame(() => searchRef.current?.focus());
  }, []);

  const selectOption = useCallback(
    (tz: string) => {
      onChange(tz);
      setIsOpen(false);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightIndex >= 0 && highlightIndex < flatFiltered.length) {
            selectOption(flatFiltered[highlightIndex].value);
            triggerRef.current?.focus();
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, highlightIndex, flatFiltered, selectOption],
  );

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.querySelector(`[data-index="${highlightIndex}"]`);
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = useMemo(() => {
    if (!value) return "";
    const tz = TIMEZONE_DATA.find((t) => t.value === value);
    if (!tz) return value;
    return `${tz.offsetStr} \u2014 ${tz.value}`;
  }, [value]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
          className="w-full py-3 pl-12 pr-10 rounded-xl bg-muted border border-border text-foreground text-sm text-left transition-all duration-300 focus:outline-none focus:border-primary focus:bg-accent focus:shadow-[0_0_20px_rgba(119,207,151,0.15)] cursor-pointer hover:bg-accent hover:border-foreground/20"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {displayLabel || "Select your timezone"}
          </span>
        </button>
        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mt-2 rounded-xl bg-popover backdrop-blur-xl border border-border shadow-2xl shadow-black/40 overflow-hidden"
              role="listbox"
              aria-label="Timezone options"
            >
              {/* Search */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setHighlightIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search timezone..."
                    className="w-full h-9 pl-8 pr-7 rounded-lg bg-muted border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                    aria-label="Search timezones"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground/60 rounded"
                      aria-label="Clear search"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Timezone list */}
              <div ref={listRef} className="tz-list max-h-48 overflow-y-auto overscroll-contain">
                {flatFiltered.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No timezone found for &ldquo;{search}&rdquo;
                  </div>
                ) : (
                  Object.entries(filteredGroups).map(([group, tzs]) => (
                    <div key={group}>
                      <div className="sticky top-0 z-10 px-3 py-1.5 bg-popover backdrop-blur-sm border-b border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {CONTINENT_LABELS[group] || group}
                        </span>
                      </div>
                      {tzs.map((tz) => {
                        const flatItem = flatFiltered.find((f) => f.value === tz.value);
                        const idx = flatItem?.idx ?? -1;
                        const isSelected = tz.value === value;
                        const isHighlighted = idx === highlightIndex;
                        return (
                          <button
                            key={tz.value}
                            type="button"
                            data-index={idx}
                            onClick={() => {
                              selectOption(tz.value);
                              triggerRef.current?.focus();
                            }}
                            onMouseEnter={() => setHighlightIndex(idx)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : isHighlighted
                                  ? "bg-accent text-foreground"
                                  : "text-muted-foreground hover:bg-muted"
                            }`}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <span className="shrink-0 w-4 flex justify-center">
                              {isSelected && <Check className="h-4 w-4" />}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground w-20 shrink-0">
                              {tz.offsetStr}
                            </span>
                            <span className="truncate flex-1">{tz.value.replace(/_/g, " ")}</span>
                            {tz.isDetected && (
                              <span className="shrink-0 text-[10px] font-medium text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">
                                detected
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-destructive text-xs pl-2 pt-1 font-medium">{error}</p>}
    </div>
  );
}

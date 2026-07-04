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
      <label className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
          className="w-full h-14 pl-12 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-left transition-all duration-300 focus:outline-none focus:border-nexus-green focus:bg-white/10 focus:shadow-[0_0_20px_rgba(119,207,151,0.15)] cursor-pointer hover:bg-white/8 hover:border-white/20"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? "text-white" : "text-white/30"}>
            {displayLabel || "Select your timezone"}
          </span>
        </button>
        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mt-2 rounded-xl bg-[#1a1b24]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden"
              role="listbox"
              aria-label="Timezone options"
            >
              {/* Search */}
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setHighlightIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search timezone... (e.g. India, New York, Tokyo)"
                    className="w-full h-10 pl-9 pr-8 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-nexus-green/60"
                    aria-label="Search timezones"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Timezone list */}
              <div ref={listRef} className="tz-list max-h-64 overflow-y-auto overscroll-contain">
                {flatFiltered.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-white/40">
                    No timezone found for &ldquo;{search}&rdquo;
                  </div>
                ) : (
                  Object.entries(filteredGroups).map(([group, tzs]) => (
                    <div key={group}>
                      <div className="sticky top-0 z-10 px-3 py-2 bg-[#1a1b24]/95 backdrop-blur-sm border-b border-white/5">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
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
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-nexus-green/10 text-nexus-green"
                                : isHighlighted
                                  ? "bg-white/8 text-white"
                                  : "text-slate-300 hover:bg-white/5"
                            }`}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <span className="shrink-0 w-4 flex justify-center">
                              {isSelected && <Check className="h-4 w-4" />}
                            </span>
                            <span className="font-mono text-xs text-white/50 w-20 shrink-0">
                              {tz.offsetStr}
                            </span>
                            <span className="truncate flex-1">{tz.value.replace(/_/g, " ")}</span>
                            {tz.isDetected && (
                              <span className="shrink-0 text-[10px] font-medium text-nexus-green/70 bg-nexus-green/10 px-1.5 py-0.5 rounded">
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

      {error && <p className="text-red-400 text-xs pl-2 pt-1 font-medium">{error}</p>}
    </div>
  );
}

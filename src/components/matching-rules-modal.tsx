'use client';

import { useState, useCallback, useMemo} from 'react';
import {
  Dialog, DialogPopup, DialogTitle,
  DialogDescription, DialogClose,
} from '@/components/ui/dialog';
import {
  Sliders, Globe, Briefcase, Users, Target,
  Save, RotateCcw, X, Info,
} from 'lucide-react';
import type { MatchingRule} from '@/types';

/**
 * Icon-Mapping fuer Matching-Regeln.
 * Ordnet einen String-Bezeichner zur passenden Lucide-Komponente zu.
 */
const ICON_MAP: Record<string, React.ElementType> = {
  Sliders, Globe, Briefcase, Users, Target,
};

/** Standardmaessige Matching-Regeln fuer das Team-Matching */
const DEFAULT_RULES: MatchingRule[] = [
  {
    id: 'skills',
    name: 'Skills-Matching',
    description: 'Wie stark ahnliche Faehigkeiten und Tech-Stacks beim Matching gewichtet werden.',
    weight: 85,
    icon: 'Sliders',
    color: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
    enabled: true,
  },
  {
    id: 'timezone',
    name: 'Zeitzonen-Ausrichtung',
    description: 'Bevorzugt Teilnehmer mit ahnlichen oder ueberlappenden Zeitzonen fuer bessere Zusammenarbeit.',
    weight: 70,
    icon: 'Globe',
    color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
    enabled: true,
  },
  {
    id: 'experience',
    name: 'Erfahrungs-Balance',
    description: 'Stellt ein ausgewogenes Verhaeltnis zwischen Junior- und Senior-Teilnehmern sicher.',
    weight: 60,
    icon: 'Briefcase',
    color: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
    enabled: true,
  },
  {
    id: 'roles',
    name: 'Rollenverteilung',
    description: 'Optimiert die Verteilung von Frontend, Backend, Fullstack, Design und Product-Rollen.',
    weight: 75,
    icon: 'Users',
    color: 'text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10',
    enabled: true,
  },
  {
    id: 'compatibility',
    name: 'Mindest-Kompatibilitaet',
    description: 'Schwellenwert fuer die mindestens erforderliche Team-Kompatibilitaet in Prozent.',
    weight: 50,
    icon: 'Target',
    color: 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
    enabled: true,
  },
];

/** Props fuer die MatchingRulesModal-Komponente */
interface MatchingRulesModalProps {
  /** Steuerung des Offen-/Geschlossen-Zustands */
  open: boolean;
  /** Callback zum Aendern des Offen-/Geschlossen-Zustands */
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal fuer die Konfiguration von Matching-Regeln.
 *
 * Ermoeglicht das Anpassen von Gewichtungen und Aktivierungs-
 * zustaende fuer verschiedene Matching-Kriterien.
 */
export function MatchingRulesModal({open, onOpenChange}: MatchingRulesModalProps) {
  const [rules, setRules] = useState<MatchingRule[]>(DEFAULT_RULES);
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Aktualisiert die Gewichtung einer einzelnen Regel.
   * @param id - Die ID der Regel
   * @param weight - Der neue Gewichtungswert (0-100)
   */
  const handleWeightChange = useCallback((id: string, weight: number) => {
    setRules(prev => prev.map(r => r.id === id ? {...r, weight} : r));
    setHasChanges(true);
  }, []);

  /**
   * Schaltet den Aktivierungszustand einer Regel um.
   * @param id - Die ID der Regel
   */
  const handleToggle = useCallback((id: string) => {
    setRules(prev => prev.map(r => r.id === id ? {...r, enabled: !r.enabled} : r));
    setHasChanges(true);
  }, []);

  /** Setzt alle Regeln auf die Standardwerte zurueck */
  const handleReset = useCallback(() => {
    setRules(DEFAULT_RULES);
    setHasChanges(false);
  }, []);

  /** Speichert die aktuelle Konfiguration (Platzhalter-Logik) */
  const handleSave = useCallback(() => {
    // TODO: Persistierung der Regeln implementieren
    setHasChanges(false);
    onOpenChange(false);
  }, [onOpenChange]);

  /** Durchschnittliche Gewichtung aller aktiven Regeln */
  const averageWeight = useMemo(() => {
    const active = rules.filter(r => r.enabled);
    if (active.length === 0) return 0;
    return Math.round(active.reduce((sum, r) => sum + r.weight, 0) / active.length);
  }, [rules]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-[580px] overflow-hidden">
        {/* Kopfbereich */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-start justify-between pr-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#77CF97]/10 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5 text-[#77CF97]" />
              </div>
              <div>
                <DialogTitle className="text-lg">Matching Rules</DialogTitle>
                <DialogDescription className="mt-0.5">
                  Konfiguriere die Kriterien fuer das Team-Matching.
                </DialogDescription>
              </div>
            </div>
            <DialogClose
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              render={<button />}
            >
              <X className="w-4 h-4" />
            </DialogClose>
          </div>

          {/* Informationsleiste */}
          <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
            <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Durchschnittliche Gewichtung: <span className="font-semibold text-slate-700 dark:text-slate-300">{averageWeight}%</span>
              {' '}&middot;{' '}
              {rules.filter(r => r.enabled).length} von {rules.length} Regeln aktiv
            </span>
          </div>
        </div>

        {/* Regelliste */}
        <div className="p-6 pt-4 space-y-1 max-h-[420px] overflow-y-auto">
          {rules.map((rule) => {
            const IconComponent = ICON_MAP[rule.icon] || Sliders;
            return (
              <div
                key={rule.id}
                className={`rounded-xl border transition-colors ${
                  rule.enabled
                    ? 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/[0.02]'
                    : 'border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] opacity-60'
                }`}
              >
                <div className="p-4">
                  {/* Regelheader */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${rule.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-white">{rule.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed max-w-[340px]">
                          {rule.description}
                        </div>
                      </div>
                    </div>

                    {/* Toggle-Switch */}
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className={`relative w-10 h-[22px] rounded-full transition-colors cursor-pointer shrink-0 ${
                        rule.enabled
                          ? 'bg-[#77CF97]'
                          : 'bg-slate-200 dark:bg-white/10'
                      }`}
                      title={rule.enabled ? 'Deaktivieren' : 'Aktivieren'}
                    >
                      <span
                        className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                          rule.enabled ? 'left-[22px]' : 'left-[3px]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Gewichtungsslider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={rule.weight}
                      onChange={(e) => handleWeightChange(rule.id, Number(e.target.value))}
                      disabled={!rule.enabled}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-slate-100 dark:bg-white/10 outline-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#77CF97] [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:dark:border-[#1a1b24] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                    />
                    <span className={`text-sm font-bold tabular-nums w-10 text-right ${
                      rule.enabled ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {rule.weight}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fussbereich mit Aktionen */}
        <div className="p-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Zuruecksetzen
          </button>
          <div className="flex gap-3">
            <DialogClose
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              render={<button />}
            >
              Abbrechen
            </DialogClose>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Regelungen speichern
            </button>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
}

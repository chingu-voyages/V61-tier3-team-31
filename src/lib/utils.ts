import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

/** Kombiniert Tailwind-Klassen mit Deduplizierung */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

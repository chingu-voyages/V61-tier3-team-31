export function calculatePercentage(value: number, total: number): string {
  if (!total) return "0%";

  return `${Math.ceil((value / total) * 100)}%`;
}

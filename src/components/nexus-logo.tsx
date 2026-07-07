export function NexusLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="#77CF97" strokeWidth="2" />
      <path
        d="M10 20L16 10L22 20"
        stroke="#77CF97"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

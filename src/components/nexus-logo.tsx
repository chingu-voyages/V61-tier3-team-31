/**
 * Nexus-Logo als SVG-Komponente.
 * Wird in Sidebar, Login und Settings verwendet.
 */
export function NexusLogo({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 28 16 V 30 L 10 40.5"
        stroke="#25cf7c"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 36 16 V 30 L 54 40.5"
        stroke="#1CB368"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 26 39.5 L 10 49"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 38 39.5 L 54 49"
        stroke="#9ca3af"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="34" r="2.5" fill="#1CB368" className="animate-pulse" />
    </svg>
  );
}

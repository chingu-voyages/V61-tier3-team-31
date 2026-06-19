/**
 * Amigo-Logo als SVG-Komponente.
 * Wird in Sidebar, Login und Settings verwendet.
 */
export function NexusLogo({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="amigo-grad" x1="40" y1="32" x2="216" y2="224" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#77CF97" />
          <stop offset="60%" stopColor="#77CF97" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" fill="#111418" rx="48" />
      <path
        d="M 128,224 C 185,224 216,180 216,136 C 216,95 192,80 176,52 C 166,80 152,90 136,90 C 120,90 112,70 100,32 C 68,80 40,112 40,144 C 40,188 71,224 128,224 Z"
        fill="url(#amigo-grad)"
      />
      <path
        d="M 76,136 C 76,176 96,196 128,196 C 160,196 180,176 180,136 C 180,116 162,106 150,116 C 140,126 136,130 128,130 C 120,130 116,126 106,116 C 94,106 76,116 76,136 Z"
        fill="#111418"
      />
      <circle cx="106" cy="154" r="12" fill="#ffffff" />
      <circle cx="150" cy="154" r="12" fill="#ffffff" />
    </svg>
  );
}

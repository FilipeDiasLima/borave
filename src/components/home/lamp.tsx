/**
 * Luminária industrial presa no alto do muro. Desenho geométrico (não ilustração):
 * cúpula esmaltada, aro aceso e lâmpada de tungstênio. O cone de luz fica em `poster-wall.tsx`.
 */
export function Lamp() {
  return (
    <svg
      className="lamp"
      viewBox="0 0 220 120"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="lamp-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--soot)" />
          <stop offset="100%" stopColor="var(--night)" />
        </linearGradient>
        <radialGradient id="lamp-bulb" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--tungsten-soft)" />
          <stop offset="55%" stopColor="var(--tungsten)" />
          <stop offset="100%" stopColor="var(--tungsten-deep)" />
        </radialGradient>
      </defs>
      {/* haste presa no muro */}
      <rect x="106" y="0" width="8" height="34" fill="var(--soot)" />
      <rect x="96" y="30" width="28" height="12" rx="3" fill="var(--soot)" />
      {/* lâmpada aparecendo sob a cúpula */}
      <ellipse cx="110" cy="94" rx="24" ry="16" fill="url(#lamp-bulb)" />
      {/* cúpula */}
      <path
        d="M78 42 C 90 36, 130 36, 142 42 L 206 92 C 160 104, 60 104, 14 92 Z"
        fill="url(#lamp-shade)"
      />
      {/* aro interno aceso */}
      <path
        d="M14 92 C 60 104, 160 104, 206 92 C 160 110, 60 110, 14 92 Z"
        fill="var(--tungsten)"
        opacity="0.9"
      />
    </svg>
  )
}

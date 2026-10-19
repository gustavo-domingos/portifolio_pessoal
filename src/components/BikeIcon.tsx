/** Mesma bicicleta do mapa, em SVG, usada na linha do tempo. */
export function BikeIcon({ flip = false }: { flip?: boolean }) {
  return (
    <g>
      <circle r="15" fill="var(--terreno)" stroke="var(--trilha)" strokeWidth="1.5" />
      <g
        transform={flip ? 'scale(-1 1)' : undefined}
        fill="none"
        stroke="var(--tinta)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="-5.5" cy="3" r="4" />
        <circle cx="5.5" cy="3" r="4" />
        <path d="M-5.5 3H-1L3-3H-3L-1 3M-5.5 3L-3-3M-4.5-5H-1.5M5.5 3L3-5L5-6" />
      </g>
    </g>
  )
}

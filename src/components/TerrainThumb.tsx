import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'
import type { Point } from '../lib/topo'
import { drawStaticTerrain } from '../lib/topoMap'

/** Trilha determinística a partir da semente: atravessa o terreno da esquerda para a direita. */
function routeFromSeed(seed: number): Point[] {
  let s = seed
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  return [
    [-0.05, 0.3 + rnd() * 0.4],
    [0.3, 0.2 + rnd() * 0.6],
    [0.65, 0.2 + rnd() * 0.6],
    [1.05, 0.3 + rnd() * 0.4],
  ]
}

interface TerrainThumbProps {
  seed: number
  className?: string
}

/** Miniatura decorativa: cada projeto tem o seu terreno. */
export function TerrainThumb({ seed, className }: TerrainThumbProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [theme] = useTheme()

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const route = routeFromSeed(seed)
    const draw = () => drawStaticTerrain(canvas, host, seed, route)
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(host)
    return () => ro.disconnect()
  }, [seed, theme])

  return (
    <div ref={hostRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

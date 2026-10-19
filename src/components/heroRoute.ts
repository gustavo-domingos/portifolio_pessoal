import type { Point } from '../lib/topo'

export type LabelPosition = 'above' | 'below' | 'right'
export type LabelAnchor = 'start' | 'center' | 'end'

export interface RouteLayout {
  /** Pontos da trilha em frações do mapa. */
  route: Point[]
  /** Índice, em `route`, de cada parada. */
  stops: number[]
  labels: { position: LabelPosition; anchor: LabelAnchor }[]
  /** Deslocamento da bicicleta em cada parada, para o lado oposto ao rótulo. */
  bikeOffsets: Point[]
}

/** Telas largas: a trilha corre na metade de baixo, da esquerda para a direita. */
export const WIDE_LAYOUT: RouteLayout = {
  route: [
    [0.07, 0.84], [0.17, 0.74], [0.29, 0.66], [0.39, 0.77], [0.5, 0.72], [0.58, 0.6],
    [0.65, 0.52], [0.72, 0.63], [0.79, 0.63], [0.85, 0.49], [0.92, 0.4],
  ],
  stops: [0, 2, 4, 6, 8, 10],
  labels: [
    { position: 'below', anchor: 'start' },
    { position: 'above', anchor: 'center' },
    { position: 'below', anchor: 'center' },
    { position: 'above', anchor: 'center' },
    { position: 'below', anchor: 'center' },
    { position: 'above', anchor: 'end' },
  ],
  bikeOffsets: [[0, -30], [0, 30], [0, -30], [0, 30], [0, -30], [0, 30]],
}

/** Celular: a trilha sobe em zigue-zague no rodapé do mapa, com os rótulos ao lado. */
export const NARROW_LAYOUT: RouteLayout = {
  route: [
    [0.08, 0.93], [0.3, 0.925], [0.52, 0.865], [0.34, 0.81], [0.1, 0.795], [0.3, 0.755],
    [0.52, 0.725], [0.36, 0.675], [0.1, 0.655], [0.32, 0.61], [0.54, 0.585],
  ],
  stops: [0, 2, 4, 6, 8, 10],
  labels: Array.from({ length: 6 }, () => ({ position: 'right' as const, anchor: 'start' as const })),
  bikeOffsets: Array.from({ length: 6 }, (): Point => [0, -30]),
}

export const HERO_SEED = 20230401

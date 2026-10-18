import { describe, expect, it } from 'vitest'
import { catmullRom, contourSegments, createNoise, measure, pointAt, type Point } from './topo'

describe('createNoise', () => {
  it('é determinístico para a mesma semente e fica em [0, 1]', () => {
    const a = createNoise(42)
    const b = createNoise(42)
    for (let i = 0; i < 50; i++) {
      const x = i * 0.37
      const y = i * 0.19
      expect(a(x, y)).toBe(b(x, y))
      expect(a(x, y)).toBeGreaterThanOrEqual(0)
      expect(a(x, y)).toBeLessThanOrEqual(1)
    }
  })

  it('muda com a semente', () => {
    expect(createNoise(1)(3.3, 4.4)).not.toBe(createNoise(2)(3.3, 4.4))
  })
})

describe('contourSegments', () => {
  it('não gera curvas num campo plano', () => {
    const field = new Float32Array(9).fill(0.5)
    let count = 0
    contourSegments(field, 3, 3, 10, 0.3, () => count++)
    expect(count).toBe(0)
  })

  it('traça uma curva vertical no meio de uma rampa da esquerda para a direita', () => {
    // 0.1 | 0.9 em cada linha: a curva de nível 0.5 passa em x = 5
    const field = [0.1, 0.9, 0.1, 0.9]
    const segments: number[][] = []
    contourSegments(field, 2, 2, 10, 0.5, (_major, x1, y1, x2, y2) => segments.push([x1, y1, x2, y2]))
    expect(segments).toEqual([[5, 0, 5, 10]])
  })

  it('marca a curva mestra a cada cinco níveis', () => {
    const field = [0.05, 0.95, 0.05, 0.95]
    const majors: boolean[] = []
    contourSegments(field, 2, 2, 10, 0.1, (major) => majors.push(major))
    // níveis 1 a 9 cruzam a célula; só o nível 5 é mestra
    expect(majors).toHaveLength(9)
    expect(majors.filter(Boolean)).toHaveLength(1)
  })
})

describe('trilha', () => {
  const pts: Point[] = [[0, 0], [10, 0], [10, 10]]

  it('catmullRom passa pelo primeiro e pelo último ponto', () => {
    const curve = catmullRom(pts, 8)
    expect(curve[0]).toEqual([0, 0])
    expect(curve[curve.length - 1]).toEqual([10, 10])
    expect(curve).toHaveLength(2 * 8 + 1)
  })

  it('pointAt percorre a linha pelo comprimento', () => {
    const line = measure([[0, 0], [10, 0], [10, 10]])
    expect(line.total).toBe(20)
    expect(pointAt(line, 0)).toMatchObject({ x: 0, y: 0 })
    expect(pointAt(line, 0.25)).toMatchObject({ x: 5, y: 0 })
    expect(pointAt(line, 0.75)).toMatchObject({ x: 10, y: 5 })
    expect(pointAt(line, 1)).toMatchObject({ x: 10, y: 10 })
  })

  it('pointAt limita frações fora de [0, 1]', () => {
    const line = measure([[0, 0], [4, 0]])
    expect(pointAt(line, -1)).toMatchObject({ x: 0 })
    expect(pointAt(line, 2)).toMatchObject({ x: 4 })
  })
})

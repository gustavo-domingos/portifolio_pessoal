import { describe, expect, it } from 'vitest'
import { en } from './en'
import { pt } from './pt'

describe('conteúdo', () => {
  it('pt e en têm os mesmos cases, na mesma ordem', () => {
    expect(en.projects.cases.map((c) => c.id)).toEqual(pt.projects.cases.map((c) => c.id))
  })

  it('pt e en têm as mesmas paradas e itens de trajetória', () => {
    expect(en.hero.stops.map((s) => s.target)).toEqual(pt.hero.stops.map((s) => s.target))
    expect(en.journey.items.map((i) => i.id)).toEqual(pt.journey.items.map((i) => i.id))
  })

  it('cada case tem a mesma quantidade de itens nos dois idiomas', () => {
    pt.projects.cases.forEach((c, i) => {
      const e = en.projects.cases[i]
      expect(e.highlights.length).toBe(c.highlights.length)
      expect(e.learned.length).toBe(c.learned.length)
      expect(e.sources.length).toBe(c.sources.length)
      expect(e.images?.map((i) => i.src)).toEqual(c.images?.map((i) => i.src))
      expect(e.seed).toBe(c.seed)
    })
  })

  it('toda citação aponta para uma fonte que existe', () => {
    for (const c of [...pt.projects.cases, ...en.projects.cases]) {
      for (const h of c.highlights) {
        if (h.source !== undefined) expect(c.sources[h.source - 1], `${c.id}: fonte ${h.source}`).toBeDefined()
      }
    }
  })

  it('paradas e cases da trajetória apontam para cases que existem', () => {
    const ids = new Set(pt.projects.cases.map((c) => c.id))
    const journeyIds = new Set(pt.journey.items.map((i) => i.id))
    for (const stop of pt.hero.stops) {
      if (stop.target.kind === 'case') expect(ids.has(stop.target.id)).toBe(true)
      else expect(journeyIds.has(stop.target.id)).toBe(true)
    }
    for (const item of pt.journey.items) item.cases?.forEach((id) => expect(ids.has(id)).toBe(true))
  })
})

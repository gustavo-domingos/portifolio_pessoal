// Formato de todo o texto do site. pt.ts e en.ts implementam este tipo,
// então o TypeScript avisa se uma tradução ficar faltando.

export type Lang = 'pt' | 'en'

export type CaseId = 'rotas-coletas' | 'horas-complementares' | 'quem-eu-voto' | 'crm-delice'
export type JourneyId = 'lince' | 'crm' | 'ottimizza' | 'projetos-2026' | 'agora'

export interface Link {
  label: string
  href: string
}

/** Item de lista que pode citar uma fonte (índice em `sources`, começando em 1). */
export interface Cited {
  text: string
  source?: number
}

/** Print de tela de um case, servido de /public. Sempre com dados fictícios. */
export interface CaseImage {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export interface CaseStudy {
  id: CaseId
  title: string
  /** Natureza do projeto: pessoal, em equipe, em implantação... */
  kind: string
  period: string
  summary: string
  problem: string
  solution: string
  highlightsTitle: string
  highlights: Cited[]
  learned: string[]
  role: string
  stack: string[]
  links: Link[]
  /** Aviso mostrado quando não há link público (repositório privado, por exemplo). */
  note?: string
  sources: Link[]
  images?: CaseImage[]
  /** Semente do terreno da miniatura. */
  seed: number
}

export interface JourneyItem {
  id: JourneyId
  date: string
  title: string
  role: string
  period?: string
  bullets?: string[]
  cases?: CaseId[]
}

export type StopTarget = { kind: 'case'; id: CaseId } | { kind: 'journey'; id: JourneyId }

export interface Stop {
  label: string
  date: string
  target: StopTarget
}

export interface Content {
  meta: { title: string; description: string }
  nav: {
    skip: string
    label: string
    journey: string
    projects: string
    about: string
    stack: string
    contact: string
    menu: string
  }
  ui: {
    themeToLight: string
    themeToDark: string
    langSwitch: string
    langSwitchLabel: string
    pauseTerrain: string
    playTerrain: string
    readCase: string
    close: string
    copy: string
    copied: string
    copyFailed: string
    problem: string
    solution: string
    learned: string
    role: string
    stack: string
    links: string
    sources: string
    sourceRef: string
    openStop: string
    mapLabel: string
    trailLabel: string
  }
  hero: {
    name: string
    lede: string
    ctaProjects: string
    ctaCv: string
    legend: { contour: string; index: string; trail: string }
    stops: Stop[]
  }
  journey: {
    title: string
    intro: string
    items: JourneyItem[]
    educationTitle: string
    education: { title: string; school: string; status: string }[]
  }
  projects: { title: string; intro: string; cases: CaseStudy[] }
  about: {
    title: string
    paragraphs: string[]
    sitesTitle: string
    sites: { name: string; why: string }[]
  }
  stack: { title: string; intro: string; groups: { name: string; items: string[] }[]; note: string }
  contact: {
    title: string
    text: string
    email: string
    links: Link[]
    cv: Link
  }
  footer: { text: string; source: Link }
}

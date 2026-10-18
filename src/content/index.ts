import { en } from './en'
import { pt } from './pt'
import type { Content, Lang } from './types'

export const content: Record<Lang, Content> = { pt, en }

export type * from './types'

import { ActionTypes } from './Action'
import { Point } from '../Model/Point'

export type FoundryKey = keyof typeof ComponentFoundry
export type FoundryParam = { [K in FoundryKey]: Parameters<typeof ComponentFoundry[K]> }
type FoundaryReturn = ReturnType<typeof ComponentFoundry[FoundryKey]>

export type Component<K extends FoundryKey> = ReturnType<typeof ComponentFoundry[K]>
export type Components = UnionToIntersection<FoundaryReturn>

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export const ComponentFoundry = {
  name: (name: string) => {
    return { name }
  },
  form: (char: string, color: string, bgColor = 'transparent') => {
    return { form: { char, color, bgColor } }
  },
  position: (position: Point) => {
    return { position }
  },
  tag: (...tags: TagKeys[]) => {
    return tags.reduce((acc, curr) => {
      return { ...acc, [curr]: true }
    }, {} as { [K in TagKeys]?: true })
  },
  trodOn: (msg: string) => {
    return { trodOn: { msg } }
  },
  acting: (action: ActionTypes) => {
    return { acting: action }
  },
  fieldOfView: (radius: number, visible = new Set<Point>()) => {
    return { fieldOfView: { radius, visible } }
  },
}

export type TagKeys =
  | 'blocksMovement'
  | 'blocksLight'
  | 'playerControlled'
  | 'memorable'
  | 'actor'
  | 'meleeAttackTarget'
  | 'dead'
  | 'being'
  | 'feature'
  | 'terrain'

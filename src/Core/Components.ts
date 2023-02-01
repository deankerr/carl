import { ActionTypes } from './Action'
import { Point } from '../Model/Point'

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

  tag: (...tags: Tag[]) => {
    return tags.reduce((acc, curr) => {
      return { ...acc, [curr]: true }
    }, {} as { [K in Tag]?: true })
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

  formSet: (formSet: string[]) => {
    return { formSet }
  },

  formSetTriggers: (...tags: Tag[]) => {
    return { formSetTriggers: tags }
  },

  formSetAutoCycle: (frequency: number, current = 0, lastUpdate = 0) => {
    return { formSetAutoCycle: { frequency, current, lastUpdate } }
  },

  emitLight: (color: string, enabled = true) => {
    return { emitLight: { color, enabled } }
  },

  lightFlicker: (frequency: number, current = false, lastUpdate = 0) => {
    return { lightFlicker: { frequency, current, lastUpdate } }
  },

  lightHueRotate: (addHue: number) => {
    return { lightHueRotate: addHue }
  },
}

export type Tag =
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
  | 'isClosed'
  | 'isOpen'
  | 'renderUnderBeing'
  | 'signalModified' // todo Pool should add these
  | 'signalLightPathUpdated'

export type FoundryKey = keyof typeof ComponentFoundry
export type FoundryParam = { [K in FoundryKey]: Parameters<typeof ComponentFoundry[K]> }
type FoundaryReturn = ReturnType<typeof ComponentFoundry[FoundryKey]>

export type Component<K extends FoundryKey> = ReturnType<typeof ComponentFoundry[K]>
export type Components = UnionToIntersection<FoundaryReturn>

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

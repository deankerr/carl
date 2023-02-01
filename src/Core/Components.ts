import { ActionTypes } from './Action'
import { Point } from '../Model/Point'

export const ComponentFoundry = {
  acting: (action: ActionTypes) => {
    return { acting: action }
  },

  emitLight: (color: string, enabled = true) => {
    return { emitLight: { color, enabled } }
  },

  fieldOfView: (radius: number, visible = new Set<Point>()) => {
    return { fieldOfView: { radius, visible } }
  },

  form: (char: string, color: string, bgColor = 'transparent') => {
    return { form: { char, color, bgColor } }
  },

  formSet: (formSet: string[]) => {
    return { formSet }
  },

  formSetAutoCycle: (frequency: number, current = 0, lastUpdate = 0) => {
    return { formSetAutoCycle: { frequency, current, lastUpdate } }
  },

  formSetTriggers: (...tags: Tag[]) => {
    return { formSetTriggers: tags }
  },

  lightFlicker: (frequency: number, current = false, lastUpdate = 0) => {
    return { lightFlicker: { frequency, current, lastUpdate } }
  },

  lightHueRotate: (addHue: number) => {
    return { lightHueRotate: addHue }
  },

  name: (name: string) => {
    return { name }
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
}

export type Tag =
  | 'actor'
  | 'being'
  | 'blocksLight'
  | 'blocksMovement'
  | 'dead'
  | 'feature'
  | 'isClosed'
  | 'isOpen'
  | 'meleeAttackTarget'
  | 'memorable'
  | 'playerControlled'
  | 'renderUnderBeing'
  | 'signalLightPathUpdated'
  | 'signalModified'
  | 'terrain'

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

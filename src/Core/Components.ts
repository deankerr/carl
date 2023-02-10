import { ActionTypes } from './Action'
import { Point } from '../Model/Point'
import { EntityKey } from './Entity'

export const ComponentFoundry = {
  acting: (action: ActionTypes) => {
    return { acting: action }
  },

  emitLight: (color: string, enabled = true) => {
    return { emitLight: { color, enabled } } // todo add flicker option
  },

  fieldOfView: (radius: number, visible = new Set<Point>()) => {
    return { fieldOfView: { radius, visible } }
  },

  tile: (char: string, color: string, bgColor = 'transparent') => {
    return { tile: { char, color, bgColor } }
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

  tileVariant: (...keys: EntityKey[]) => {
    return { tileVariant: keys }
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
  | 'signalLightPathUpdated'
  | 'signalModified'
  | 'signalUpdatePlayerFOV'
  | 'terrain'
  | 'face'
  | 'door'
  | 'hasDoorNorth'
  | 'renderAbove'
  | 'wall'
  | 'floor'

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

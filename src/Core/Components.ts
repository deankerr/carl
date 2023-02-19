import { ActionTypes } from './Action'
import { Point } from '../lib/Shape/Point'
import { EntityKey } from './Entity'
import { SpriteConfig, SpriteManager } from './Sprite'
import { Cardinal } from '../lib/direction'

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

  name: (name: string) => {
    return { name }
  },

  position: (position: Point) => {
    return { position }
  },

  tag: (...tags: string[]) => {
    return tags.reduce((acc, curr) => {
      return { ...acc, [curr]: true }
    }, {} as { [K in Tag]?: true })
  },

  trodOn: (msg: string) => {
    return { trodOn: { msg } }
  },

  bumpMessage: (msg: string) => {
    return { bumpMessage: { msg } }
  },

  portal: (zone: string, level: 'down' | 'up' | number) => {
    return { portal: { zone, level } }
  },

  // todo better typing
  sprite: (spriteMan: SpriteManager, spriteConfig: object) => {
    return { sprite: spriteMan.register(spriteConfig as SpriteConfig) }
  },

  facing: (dir: Cardinal) => {
    return { facing: dir }
  },

  tint: (color: string, bgColor = 'transparent') => {
    return { color, bgColor }
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
  | 'playerControlled'
  | 'signalLightPathUpdated'
  | 'signalModified'
  | 'signalUpdatePlayerFOV'
  | 'terrain'
  | 'door'
  | 'renderLevelHigh'
  | 'wall'
  | 'floor'
  | 'liquid'
  | 'debug'
  | 'isHorizontal'
  | 'isVertical'
  | 'invisible'
  | 'hostile'
  | 'friendly'
  | 'item'
  | 'ledge'

export type FoundryKey = keyof typeof ComponentFoundry
export type FoundryParam = { [K in FoundryKey]: Parameters<typeof ComponentFoundry[K]> }
type FoundryReturn = ReturnType<typeof ComponentFoundry[FoundryKey]>

export type Component<K extends FoundryKey> = ReturnType<typeof ComponentFoundry[K]>
export type Components = UnionToIntersection<FoundryReturn>

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

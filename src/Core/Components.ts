import { Cardinal } from '../lib/direction'
import { Point } from '../lib/Shape/Point'
import { ActionTypes } from './Action'
import { SpriteConfig, SpriteManager } from './Sprite'

export type FoundryKey = keyof typeof ComponentFoundry
export type FoundryParam = { [K in FoundryKey]: Parameters<typeof ComponentFoundry[K]> }
export type FoundryReturn = ReturnType<typeof ComponentFoundry[FoundryKey]>

export type Component<K extends FoundryKey> = ReturnType<typeof ComponentFoundry[K]>
export type Components = UnionToIntersection<FoundryReturn>

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export const ComponentFoundry = {
  acting: (action: ActionTypes) => {
    return { acting: action }
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

  tag: (...tags: Tag[]) => {
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

  sprite: (spriteMan: SpriteManager, spriteConfig: SpriteConfig) => {
    return { sprite: spriteMan.register(spriteConfig) }
  },

  facing: (dir: Cardinal) => {
    return { facing: dir }
  },

  color: (color: string, bgColor: string) => {
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
  | 'signalPlayerMoved'
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

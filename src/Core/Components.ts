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

  bumpMessage: (msg: string) => {
    return { bumpMessage: { msg } }
  },

  children: (north: string, east: string, south: string, west: string) => {
    return { children: { north, east, south, west } }
  },

  color: (color: string, bgColor: string) => {
    return { color, bgColor }
  },

  facing: (dir: Cardinal) => {
    return { facing: dir }
  },

  fieldOfView: (radius: number, visible = new Set<Point>()) => {
    return { fieldOfView: { radius, visible } }
  },

  name: (name: string) => {
    return { name }
  },

  portal: (zone: string, level: 'down' | 'up' | number) => {
    return { portal: { zone, level } }
  },

  position: (position: Point) => {
    return { position }
  },

  sprite: (spriteMan: SpriteManager, spriteConfig: SpriteConfig) => {
    return { sprite: spriteMan.register(spriteConfig) }
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
  | 'stairs'
  | 'down'
  | 'up'
  | 'liquid'
  | 'debug'
  | 'isHorizontal'
  | 'isVertical'
  | 'invisible'
  | 'hostile'
  | 'friendly'
  | 'item'
  | 'ledge'
  | 'outOfBounds'

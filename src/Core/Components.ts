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

  render: (char: string, color = 'transparent', bgColor = 'transparent') => {
    return { render: { char, color, bgColor } }
  },

  tiles: (...tiles: string[]) => {
    return { tiles }
  },

  tilesAutoCycle: (frequency = 0, current = 0, lastUpdate = 0) => {
    return { tilesAutoCycle: { frequency, current, lastUpdate } }
  },

  tilesAutoRandom: (frequency = 0, current = 0, lastUpdate = 0) => {
    return { tilesAutoRandom: { frequency, current, lastUpdate } }
  },

  tileTriggers: (...tags: Tag[]) => {
    return { tileTriggers: tags }
  },

  tilesVertical: (...tilesVertical: string[]) => {
    return { tilesVertical }
  },

  tilesHorizontal: (...tilesHorizontal: string[]) => {
    return { tilesHorizontal }
  },

  tilesLedge: (...tilesLedge: string[]) => {
    return { tilesLedge }
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

  tileVariant: (...keys: EntityKey[]) => {
    return { tileVariant: keys }
  },

  baseVariant: (key: EntityKey) => {
    return { baseVariant: key }
  },

  ledgeVariant: (key: EntityKey) => {
    return { ledgeVariant: key }
  },

  portal: (zone: string, level: 'down' | 'up' | number) => {
    return { portal: { zone, level } }
  },

  // ! dev
  sprite: (spriteMan: SpriteManager, spriteConfig: any) => {
    return { sprite: spriteMan.register(spriteConfig) }
  },

  facing: (dir: Cardinal) => {
    return { facing: dir }
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
  | 'hasDoorNorth'
  | 'renderLevelHigh'
  | 'wall'
  | 'floor'
  | 'liquid'
  | 'debug'
  | 'isLedge'
  | 'isHorizontal'
  | 'isVertical'
  | 'pickTile'
  | 'pickTileEqually'
  | 'pickTileCorner'
  | 'pickTileLedge'
  | 'invisible'
  | 'hostile'
  | 'friendly'
  | 'item'
  | 'ledge'

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

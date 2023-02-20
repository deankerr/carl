import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { heatMapColor } from '../lib/color'
import { DijkstraMap } from '../lib/Dijkstra'
import { Point, point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'
import { Queue, rnd } from '../lib/util'
import { Entity, EntityKey, EntityWith } from './Entity'
import { Visualizer } from './Visualizer'

export class Region {
  // structural
  rect: Rect
  visibility: VisibilityTheme
  noise = new ROT.Noise.Simplex()
  heatMap = new DijkstraMap()

  visualizer: Visualizer | undefined

  // entity
  pool = window.game.pool
  terrainMap = new Map<Point, Entity>()
  entityList: Entity[] = []
  turnQueue = new Queue<number>()
  debugSymbolMap = new Map<Point, Entity>()

  // config
  recallAll = CONFIG.recallAll
  revealAll = CONFIG.revealAll

  // render data cache
  areaVisible = new Map<Point, boolean>()
  areaKnown = new Map<Point, boolean>()
  areaTransparentCache = new Map<Point, boolean>()
  hasChanged = true

  constructor(
    readonly width: number,
    readonly height: number,
    public name = 'Somewhere',
    visibility: keyof typeof visibilityTheme = 'dark'
  ) {
    this.rect = Rect.at(point(0, 0), this.width, this.height)
    this.visibility = visibilityTheme[visibility]
  }

  //  * Entity Management
  create(pt: Point, key: EntityKey): Entity | undefined {
    if (!this.rect.pointIntersects(pt)) return
    if (key.includes('Door')) return this.createDoor(pt, key)

    const entity = this.pool.spawn(key, pt)
    if (entity.terrain) this.terrainMap.set(pt, entity)
    else this.entityList.push(entity)

    this.hasChanged = true
    return entity
  }

  createDoor(pt: Point, key: EntityKey) {
    // switch to vertical door if needed, which has two pieces
    if (this.terrainAt(pt.add(0, -1)).blocksMovement) {
      const keyTop = (key + 'VerticalTop') as EntityKey
      const keyV = (key + 'Vertical') as EntityKey

      const doorNorth = this.pool.spawn(keyTop, pt.add(0, -1))
      const door = this.pool.spawn(keyV, pt)
      this.entityList.push(door, doorNorth)
      this.hasChanged = true
      return door
    } else {
      // spawn normally
      const entity = this.pool.spawn(key, pt)
      this.entityList.push(entity)
      this.hasChanged = true
      return entity
    }
  }

  modify(entity: Entity) {
    this.hasChanged = true
    return this.pool.modify(entity)
  }

  destroy(entity: Entity) {
    this.entityList = this.entityList.filter(e => e.eID !== entity.eID)

    // turn queue
    if (entity.actor) {
      this.turnQueue.remove(entity.eID)
    }

    this.pool.live.delete(entity)
  }

  // * Entity Queries
  // return all local entities with these components
  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const results = this.entityList.filter(e => components.every(name => name in e)) as EntityWith<
      Entity,
      Key
    >[]
    return results
  }

  // all entities with a specified position
  at(pt: Point) {
    return [
      this.terrainAt(pt),
      ...this.entityList.filter(e => e.position && e.position === pt),
    ] as EntityWith<Entity, 'position'>[]
  }

  // terrain entity at this position
  terrainAt(pt: Point) {
    return this.inBounds(pt)
      ? this.terrainMap.get(pt) ?? { ...this.pool.symbolic('nothing'), fake: true }
      : this.pool.symbolic('endlessVoid')
  }

  // test if an entity has components, mark as available if so, otherwise return null
  has<Key extends keyof Entity>(
    entity: Entity,
    ...components: Key[]
  ): EntityWith<Entity, Key> | null {
    return components.every(c => c in entity) ? (entity as EntityWith<Entity, Key>) : null
  }

  getByID(eID: number) {
    const e = this.entityList.find(e => e.eID === eID)
    if (!e) throw new Error(`Unable to find entity for id ${e}`)
    return e
  }

  player() {
    const player = this.get('playerControlled')[0] as EntityWith<Entity, 'position' | 'fieldOfView'>
    return player
  }

  // * Utility

  createPlayer(ePlayer?: Entity) {
    console.log('createPlayer')
    const player = ePlayer ?? this.pool.spawn('player', this.stairsUpPoint() ?? this.rndWalkable())
    this.entityList.push(player)
    this.turnQueue.add(player.eID, true)
    return player
  }

  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  // callback for ROT.JS fov/light functions
  ROTisTransparent(x: number, y: number) {
    const pt = point(x, y)
    const cached = this.areaTransparentCache.get(pt)
    if (cached) return cached
    const entities = this.at(pt)
    const transparent = !entities.some(e => e.blocksLight)
    this.areaTransparentCache.set(pt, transparent)
    return transparent
  }

  ROTisPassable(x: number, y: number) {
    const pt = point(x, y)
    const here = this.at(pt)
    return !here.some(e => e.blocksMovement)
  }

  rndWalkable() {
    let max = 1000
    while (max-- > 0) {
      const pt = point(rnd(0, this.width - 1), rnd(0, this.height - 1))
      if (this.terrainAt(pt).blocksMovement) continue
      return pt
    }
    console.error('Failed to get random point')
    return point(rnd(0, this.width - 1), rnd(0, this.height - 1))
  }

  walkable() {
    const walkable: Point[] = []
    this.rect.traverse(pt => {
      if (!this.terrainAt(pt).blocksMovement) walkable.push(pt)
    })

    return walkable
  }

  stairsUpPoint() {
    const [stairs] = this.get('stairs', 'up')
    return stairs?.position
  }

  debugSymbol(
    pt: Point | Rect,
    tile: string | number,
    color: number | string = 'transparent',
    bgColor = 'transparent'
  ) {
    if (pt instanceof Rect) {
      pt.traverse(ppt => this.debugSymbol(pt, tile, color, bgColor))
      return
    }

    if (typeof tile === 'number') tile = nAlpha(tile)
    if (typeof color === 'number') color = heatMapColor(color)

    const d = this.debugSymbolMap.get(pt) ?? this.pool.spawn('debug', pt)
    this.pool
      .modify(d)
      .sprite({ base: [tile] })
      .define('color', color, bgColor)

    this.debugSymbolMap.set(pt, d)
  }
}

type FogLevel = Extract<EntityKey, 'nothing' | 'fogLight' | 'fogMedium' | 'fogHeavy' | 'abyss'>
type VisibilityState = 'visible' | 'shrouded' | 'unrevealed'
type VisibilityTheme = Record<VisibilityState, FogLevel>

const visibilityTheme = {
  bright: {
    visible: 'nothing',
    shrouded: 'fogLight',
    unrevealed: 'fogLight',
  },
  dark: {
    visible: 'nothing',
    shrouded: 'fogMedium',
    unrevealed: 'fogHeavy',
  },
} satisfies Record<string, VisibilityTheme>

// debug helpers
function nAlpha(n: number) {
  if (n < 0 && n > -6) return nSymbols[Math.abs(n) - 1]
  if (n < 0) return '?'
  if (n > 35) return '!'
  const map = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return map[n]
}

const nSymbols = ['auraHoly', 'auraBlue', 'auraRed', 'auraGreen', 'auraPurple']

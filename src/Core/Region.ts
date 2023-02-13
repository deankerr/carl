import { Color } from 'rot-js/lib/color'
import { CONFIG } from '../config'
import { loop, pick, Queue, rnd } from '../lib/util'
import { Point, point, pointRect } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { Entity, EntityPool, EntityKey, EntityWith } from './Entity'
import { Visualizer } from './Visualizer'

export class Region {
  name = 'Somewhere'
  rect: Rect

  terrainMap = new Map<Point, Entity>()
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  // rendering relevant data
  areaVisible = new Map<Point, boolean>()
  areaKnown = new Map<Point, boolean>()
  areaTransparentCache = new Map<Point, boolean>()

  recallAll = CONFIG.recallAll
  revealAll = CONFIG.revealAll

  lighting = new Map<Point, Color>()
  emitters = new Set<Entity>()

  hasChanged = true

  visualizer: Visualizer | undefined

  constructor(
    readonly width: number,
    readonly height: number,
    readonly pool: EntityPool,
    player?: Entity
  ) {
    this.rect = Rect.at(point(0, 0), this.width, this.height)
    if (player) this.createPlayer(player)
  }

  //  * Entity Management
  createEntity(pt: Point, key: EntityKey) {
    const entity = this.pool.spawn(key, pt)
    // if (entity.door) return this.createDoor(pt, key)
    this.entities.push(entity)
    this.hasChanged = true
    return entity
  }

  createTerrain(pt: Point, key: EntityKey) {
    const terrain = this.pool.spawn(key, pt)

    this.terrainMap.set(pt, terrain)
    this.hasChanged = true
  }

  entity(entity: Entity) {
    this.hasChanged = true
    return this.pool.entity(this.entities, entity)
  }

  destroyEntity(entity: Entity) {
    console.log('destroy entity', entity.label)
    this.entities = this.entities.filter(e => e.eID !== entity.eID)

    // turn queue
    if (entity.actor) {
      this.turnQueue.remove(entity.eID)
    }
  }

  // * Entity Queries
  // return all local entities with these components
  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const results = this.entities.filter(e => components.every(name => name in e)) as EntityWith<
      Entity,
      Key
    >[]
    return results
  }

  // all entities with a specified position
  at(pt: Point) {
    return [
      this.terrainAt(pt),
      ...this.entities.filter(e => e.position && e.position === pt),
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
    const e = this.entities.find(e => e.eID === eID)
    if (!e) throw new Error(`Unable to find entity for id ${e}`)
    return e
  }

  player() {
    const player = this.get('playerControlled')[0] as EntityWith<Entity, 'position' | 'fieldOfView'>
    return player ?? this.createPlayer()
  }

  // * Utility

  createPlayer(ePlayer?: Entity) {
    console.log('createPlayer')
    const player = ePlayer ?? this.pool.spawn('player', this.rndWalkable())
    this.entities.push(player)
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

  variant(pt: Point, key: EntityKey): EntityKey {
    const e = this.pool.symbolic(key)
    if (e.door && e.tileVariant) {
      console.log('door var', this.terrainAt(pt.add(0, -1)).blocksMovement)
      if (this.terrainAt(pt.add(0, -1)).blocksMovement) return e.tileVariant[0] as EntityKey
    }

    return key
  }

  createDoor(pt: Point, key: EntityKey) {
    // switch to vertical door if needed, which has two pieces
    const useVariant = this.terrainAt(pt.add(0, -1)).blocksMovement
    const sym = this.pool.symbolic(key)

    if (useVariant && sym.tileVariant) {
      const doorNorth = this.pool.spawn(sym.tileVariant[1], pt.add(0, -1))
      const door = this.pool.spawn(sym.tileVariant[0], pt)
      this.entities.push(door, doorNorth)
      return door
    }

    const entity = this.pool.spawn(key, pt)
    this.entities.push(entity)
    this.hasChanged = true
    return entity
  }

  evaluateTerrainVariants() {
    this.rect.traverse(pt => {
      const tHere = this.terrainAt(pt)
      const tAbove = this.terrainAt(pt.add(0, -1))
      const tBelow = this.terrainAt(pt.add(0, 1))

      // ledged water/pools/etc
      if (tHere.ledgeVariant) {
        if (!tAbove.isLedge && !tHere.isLedge && tAbove.label !== tHere.label) {
          this.createTerrain(pt, tHere.ledgeVariant)
        } else if (tHere.baseVariant && !tHere.isBase) this.createTerrain(pt, tHere.baseVariant)
      }

      // walls vertical/horizontal
      if (tHere.wall && tHere.tilesVertical && tHere.tilesHorizontal && tHere.render) {
        if (tBelow.wall && !tHere.isVertical) {
          tHere.render = {
            char: rnd(1) ? tHere.tilesVertical[0] : pick(tHere.tilesVertical),
            color: 'transparent',
            bgColor: 'transparent',
          }
          tHere.isVertical = true
          delete tHere.isHorizontal
        } else if (!tBelow.wall && !tHere.isHorizontal) {
          tHere.render = {
            char: rnd(1) ? tHere.tilesHorizontal[0] : pick(tHere.tilesHorizontal),
            color: 'transparent',
            bgColor: 'transparent',
          }
          tHere.isHorizontal = true
          delete tHere.isVertical
        }
      }
    })

    this.hasChanged = true
  }
}

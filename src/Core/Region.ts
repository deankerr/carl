import { Color } from 'rot-js/lib/color'
import { CONFIG } from '../config'
import { Queue, rnd } from '../lib/util'
import { Point, point, pointRect } from '../Model/Point'
import { Entity, EntityPool, EntityKey, EntityWith } from './Entity'
import { Visualizer } from './Visualizer'

/*

  areaVisible = new Map<Point, boolean>()
  areaKnown = new Map<Point, boolean>()
  areaTransparent = new Map<Point, boolean>()

*/

export class Region {
  name = 'Somewhere'

  terrainMap = new Map<Point, Entity>()
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  // player info
  areaVisible = new Map<Point, boolean>()
  areaKnown = new Map<Point, boolean>()

  recallAll = CONFIG.recallAll
  revealAll = CONFIG.revealAll

  lighting = new Map<Point, Color>()

  hasChanged = true

  visualizer: Visualizer | undefined

  palette = {
    solid: '#006666',
    ground: '#090909',
    unknown: '#000000',
  }

  constructor(
    readonly width: number,
    readonly height: number,
    readonly pool: EntityPool,
    player?: Entity
  ) {
    this.createPlayer(player)
  }

  //  * Entity Management
  createEntity(key: EntityKey, pt: Point) {
    const entity = this.pool.spawn(key, pt)
    this.entities.push(entity)
    this.hasChanged = true
    return entity
  }

  createTerrain(key: EntityKey, pt: Point) {
    const terrain = this.pool.symbolic(key)
    this.terrainMap.set(pt, terrain)
    this.hasChanged = true
  }

  entity(entity: Entity) {
    this.hasChanged = true
    return this.pool.entity(this.entities, entity)
  }

  destroy(entity: Entity) {
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
      ? this.terrainMap.get(pt) ?? this.pool.symbolic('ground')
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
    return this.get('playerControlled')[0] as EntityWith<Entity, 'position' | 'fieldOfView'>
  }

  // * Utility

  createPlayer(ePlayer?: Entity) {
    console.log('createPlayer')
    const player = ePlayer ?? this.pool.spawn('player', point(this.width >> 1, this.height >> 1))
    this.entities.push(player)
    this.turnQueue.add(player.eID, true)
    return player
  }

  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  // callback for ROT.JS fov/light functions
  ROTisTransparent(x: number, y: number) {
    const entities = this.at(point(x, y))
    return !entities.some(e => e.blocksLight)
  }

  rndWalkable() {
    let pt = point(rnd(0, this.width - 1), rnd(0, this.height - 1))
    let t = this.terrainAt(pt)
    let max = 1000
    while (t.blocksMovement && max-- > 0) {
      pt = point(rnd(0, this.width - 1), rnd(0, this.height - 1))
      t = this.terrainAt(pt)
    }
    if (max == 0) throw new Error('Could not get random walkable.')
    return pt
  }
}

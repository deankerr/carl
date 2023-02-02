import { Color } from 'rot-js/lib/color'
import { CONFIG } from '../config'
import { Queue } from '../lib/util'
import { Point, point, grid } from '../Model/Point'
import { Entity, EntityPool, EntityKey, EntityWith } from './Entity'

export class Region {
  terrainMap = new Map<Point, Entity>()
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  seenByPlayer = new Set<Point>()
  recallAll = CONFIG.recallAll
  revealAll = CONFIG.revealAll

  voidColor = '' || CONFIG.mainBackgroundColor
  lighting = new Map<Point, Color>()

  hasChanged = true

  constructor(readonly width: number, readonly height: number, readonly pool: EntityPool) {}

  render(
    callback: (pt: Point, entities: Entity[], visible: boolean, recalled: boolean) => unknown
  ) {
    const player = this.player().fieldOfView
    grid(this.width, this.height, pt => {
      const entities = this.at(pt)
      const visible = player.visible.has(pt)
      const recalled = this.seenByPlayer.has(pt)
      callback(pt, entities, this.revealAll || visible, this.recallAll || recalled)
    })
  }

  //  * Entity Management
  createEntity(key: EntityKey, pt: Point) {
    const entity = this.pool.spawn(key, pt)
    this.entities.push(entity)
  }

  createTerrain(key: EntityKey, pt: Point) {
    const terrain = this.pool.symbolic(key)
    this.terrainMap.set(pt, terrain)
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
      ? this.terrainMap.get(pt) ?? this.pool.symbolic('void')
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
    return this.entities.filter(e => e.playerControlled)[0] as EntityWith<
      Entity,
      'fieldOfView' | 'position'
    >
  }

  // * Utility
  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  // callback for ROT.JS fov/light functions
  ROTisTransparent(x: number, y: number) {
    const entities = this.at(point(x, y))
    return !entities.some(e => e.blocksLight)
  }
}

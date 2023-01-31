/* eslint-disable @typescript-eslint/no-unused-vars */
import { Queue } from '../lib/util'
import { Point, point, grid } from '../Model/Point'
import { Entity, EntityPool, EntityKey, EntityWith, TerrainKey } from './Entity'

export class Region {
  terrainMap = new Map<Point, Entity>()
  terrainBase: Entity
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  seenByPlayer = new Set<Point>()
  recallAll = true
  revealAll = false

  hasChanged = true

  constructor(
    readonly width: number,
    readonly height: number,
    readonly pool: EntityPool,
    baseTerrain: TerrainKey
  ) {
    this.terrainBase = this.pool.symbolic(baseTerrain)
  }

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

  // Entity Management
  createEntity(key: EntityKey, pt: Point) {
    const entity = this.pool.spawn(key, pt)
    this.entities.push(entity)
  }

  createTerrain(key: TerrainKey, pt: Point) {
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

  // * Entity Queries *
  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const results = this.entities.filter(e => components.every(name => name in e)) as EntityWith<
      Entity,
      Key
    >[]
    return results
  }

  at(pt: Point) {
    return [
      this.terrainAt(pt),
      ...this.entities.filter(e => e.position && e.position === pt),
    ] as EntityWith<Entity, 'position'>[]
  }

  terrainAt(pt: Point) {
    return this.inBounds(pt)
      ? this.terrainMap.get(pt) ?? this.terrainBase
      : this.pool.spawn('endlessVoid', pt)
  }

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
    return this.entities.filter(e => e.playerControlled)[0] as EntityWith<Entity, 'fieldOfView'>
  }
  // Utility
  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  ROTisTransparent(x: number, y: number) {
    const entities = this.at(point(x, y))
    return !entities.some(e => e.blocksLight)
  }

  initTurnQueue() {
    const player = this.player()
    const actors = this.get('actor').filter(a => !a.playerControlled)

    const queue = new Queue<number>()
    queue.add(player.eID, true)
    actors.forEach(a => queue.add(a.eID, true))

    this.turnQueue = queue
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Queue } from '../lib/util'
import { Point, point, grid } from '../Model/Point'
import { Entity, EntityPool, EntityKey, EntityWith, TerrainKey } from './Entity'

export class Region {
  terrainMap = new Map<Point, Entity>()
  terrainBase: Entity
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  revealed = new Set<Point>()

  hasChanged = true

  constructor(readonly width: number, readonly height: number, readonly pool: EntityPool, baseTerrain: TerrainKey) {
    const t = this.pool.symbolic(baseTerrain)
    if (!t) throw new Error('Unable to get base terrain')
    this.terrainBase = t
    const p = point(2, 2)
    console.log('p:', p)
  }

  render(callback: (pt: Point, entities: Entity[], visible: boolean, revealed: boolean) => unknown) {
    const player = this.player().fieldOfView
    grid(this.width, this.height, pt => {
      const [terrain, entities] = this.at(pt)
      const visible = player.visible.has(pt)
      const revealed = this.revealed.has(pt)
      callback(pt, [terrain, ...entities], visible, revealed)
    })
  }

  createEntity(key: EntityKey, pt: Point) {
    const entity = this.pool.spawn(key, pt)
    this.entities.push(entity)
  }

  createTerrain(key: TerrainKey, pt: Point) {
    const terrain = this.pool.symbolic(key)
    this.terrainMap.set(pt, terrain)
  }

  being(key: EntityKey, pt: Point) {
    const being = window.game.pool.spawn(key, pt)
    this.entities.push(being)
    this.turnQueue.add(being.eID, true)
  }

  feature(key: EntityKey, pt: Point) {
    const feature = window.game.pool.spawn(key, pt)
    this.entities.push(feature)
  }

  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const results = this.entities.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
    return results
  }

  player() {
    return this.entities.filter(e => e.playerControlled)[0] as EntityWith<Entity, 'fieldOfView'>
  }

  at(pt: Point): [Entity, Entity[]] {
    return [this.terrainAt(pt), this.entities.filter(e => e.position && e.position === pt)]
  }

  terrainAt(pt: Point) {
    return this.inBounds(pt) ? this.terrainMap.get(pt) ?? this.terrainBase : this.pool.spawn('endlessVoid', pt)
  }

  getByID(eID: number) {
    const e = this.entities.find(e => e.eID === eID)
    if (!e) throw new Error(`Unable to find entity for id ${e}`)
    return e
  }

  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  ROTisTransparent(x: number, y: number) {
    const [terrain, entities] = this.at(point(x, y))
    return !(terrain.blocksLight || entities.some(e => e.blocksLight))
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

  initTurnQueue() {
    const player = this.player()
    const actors = this.get('actor').filter(a => !a.playerControlled)

    const queue = new Queue<number>()
    queue.add(player.eID, true)
    actors.forEach(a => queue.add(a.eID, true))

    this.turnQueue = queue
  }
}

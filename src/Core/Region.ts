/* eslint-disable @typescript-eslint/no-unused-vars */
import { Queue } from '../lib/util'
import { Point } from '../Model/Point'
import { Components, TagKeys, ComponentFoundry } from './Components'
import { Entity, EntityPool, EntityLabel, EntityWith, TerrainLabel } from './Entity'

export class Region {
  terrain = new Map<Point, Entity>()
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  constructor(
    readonly width: number,
    readonly height: number,
    readonly baseTerrain: TerrainLabel,
    readonly pool: EntityPool,
    readonly components = ComponentFoundry
  ) {}

  render(callback: (pt: Point, entities: Entity[]) => unknown) {
    window.game.point.grid(this.width, this.height, pt => {
      const terrain = this.terrainAt(pt)
      const entities = this.get('form', 'position').filter(e => e.position.pt === pt)

      callback(pt, [terrain, ...entities] as Entity[])
    })
  }

  being(key: EntityLabel, pt: Point) {
    const being = window.game.pool.spawn(key, pt)
    this.entities.push(being)
    this.turnQueue.add(being.eID, true)
  }

  feature(key: EntityLabel, pt: Point) {
    const feature = window.game.pool.spawn(key, pt)
    this.entities.push(feature)
  }

  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const results = this.entities.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
    return results
  }

  player() {
    return this.entities.filter(e => e.playerControlled)[0]
  }

  at(pt: Point): [Entity, Entity[]] {
    return [this.terrainAt(pt), this.entities.filter(e => e.position && e.position.pt === pt)]
  }

  terrainAt(pt: Point) {
    return this.inBounds(pt)
      ? this.terrain.get(pt) ?? this.pool.spawn(this.baseTerrain, pt)
      : this.pool.spawn('endlessVoid', pt)
  }

  getByID(eID: number) {
    const e = this.entities.find(e => e.eID === eID)
    if (!e) throw new Error(`Unable to find entity for id ${e}`)
    return e
  }

  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  entity(entity: Entity) {
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
}

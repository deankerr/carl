/* eslint-disable @typescript-eslint/no-unused-vars */
import { Queue } from '../lib/util'
import { Point } from '../Model/Point'
import { Components, TagKeys } from './Components'
import { Entity, EntityHive, EntityKey, EntityR, EntityWith } from './Entity'

export class Region {
  terrain = new Map<Point, Entity>()
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  constructor(
    readonly width: number,
    readonly height: number,
    readonly baseTerrain: EntityKey,
    readonly hive: EntityHive
  ) {}

  render(callback: (pt: Point, entities: Entity[]) => unknown) {
    window.game.point.grid(this.width, this.height, pt => {
      const terrain = this.terrainAt(pt)
      const entities = this.get('form', 'position').filter(e => e.position.pt === pt)

      callback(pt, [terrain, ...entities] as Entity[])
    })
  }

  being(key: EntityKey, pt: Point) {
    const being = window.game.hive.spawn(key, pt)
    this.entities.push(being)
    this.turnQueue.add(being.eID, true)
  }

  feature(key: EntityKey, pt: Point) {
    const feature = window.game.hive.spawn(key, pt)
    this.entities.push(feature)
  }

  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const results = this.entities.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
    return results
  }

  getTagged(tag: TagKeys) {
    return this.entities.filter(e => e.tags.includes(tag))
  }

  player() {
    return this.entities.filter(e => e.tags.includes('playerControlled'))[0]
  }

  at(pt: Point): [Entity, Entity[]] {
    return [this.terrainAt(pt), this.entities.filter(e => e.position && e.position.pt === pt)]
  }

  terrainAt(pt: Point) {
    return this.inBounds(pt)
      ? this.terrain.get(pt) ?? this.hive.spawn(this.baseTerrain, pt)
      : this.hive.spawn('endlessVoid', pt)
  }

  getRenderable() {
    return this.entities.filter(e => 'form' in e && 'position' in e) as EntityR[]
  }

  getByID(eID: number) {
    const e = this.entities.find(e => e.eID === eID)
    if (!e) throw new Error(`Unable to find entity for id ${e}`)
    return e
  }

  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  // TODO autocomplete components - allow console/UI methods of editing entities
  modify(entity: Entity, c: Components) {
    const e = { ...entity, ...c }
    const index = this.entities.findIndex(e => e === entity)
    if (index < 0) throw new Error('Unable to locate entity to modify')
    this.entities[index] = e
    console.log('modify:', e.form.name, e.eID, c)
  }

  remove(entity: Entity | Entity[], cName: keyof Entity) {
    const e = Array.isArray(entity) ? entity : [entity]

    e.forEach(e => {
      Reflect.deleteProperty(e, cName)
      console.log('remove:', e.form.name, cName)
    })
  }
}

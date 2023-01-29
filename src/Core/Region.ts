/* eslint-disable @typescript-eslint/no-unused-vars */
import { Queue } from '../lib/util'
import { Point } from '../Model/Point'
import { Components, TagKeys, ComponentFoundry } from './Components'
import { Entity, EntityHive, EntityKey, EntityR, EntityWith } from './Entity'

export class Region {
  terrain = new Map<Point, Entity>()
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  constructor(
    readonly width: number,
    readonly height: number,
    readonly baseTerrain: EntityKey,
    readonly hive: EntityHive,
    readonly components = ComponentFoundry
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
    const newEntity = { ...entity, ...c }
    const index = this.entities.findIndex(e => e === entity)
    if (index < 0) throw new Error('Unable to locate entity to modify')
    this.entities[index] = newEntity
    console.log('modify:', newEntity.form.name, newEntity.eID, c)
    return newEntity
  }

  addTag(entity: Entity, tag: TagKeys) {
    const tags = this.components.tag(...[...entity.tags, tag])
    const e = { ...entity, ...tags }
    console.log('addTag', tag, e.label, tags)
  }

  removeTag(entity: Entity, tag: TagKeys) {
    const tags = this.components.tag(...entity.tags.filter(t => t !== tag))
    const e = { ...entity, ...tags }
    console.log('removeTag', tag, e.label)
  }

  remove(entity: Entity | Entity[], cName: keyof Entity) {
    const e = Array.isArray(entity) ? entity : [entity]

    e.forEach(e => {
      Reflect.deleteProperty(e, cName)
      console.log('remove:', e.form.name, cName)
    })
  }

  destroy(entity: Entity) {
    console.log('destroy entity', entity.label)
    this.entities = this.entities.filter(e => e.eID !== entity.eID)

    // turn queue
    if (entity.tags.includes('actor')) {
      this.turnQueue.remove(entity.eID)
    }
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Queue } from '../lib/util'
import { Point } from '../Model/Point'
import { Components } from './Components'
import { Entity, EntityKey, EntityR, EntityWith } from './Entity'

export class Region {
  baseTerrain: Entity
  terrain = new Map<Point, Entity>()
  entities: Entity[] = []
  turnQueue = new Queue<number>()

  constructor(readonly width: number, readonly height: number, baseTerrain: EntityKey) {
    const { point } = window.game
    this.baseTerrain = window.game.entity.spawn(baseTerrain, point.pt(-1, -1))
    point.grid(width, height, pt => {
      if (!this.baseTerrain) this.terrain.set(pt, this.baseTerrain)
    })
  }

  // at(pt: Point) {
  //   return this.baseTerrain
  // }

  render(callback: (pt: Point, entities: EntityR[]) => unknown) {
    window.game.point.grid(this.width, this.height, pt => {
      const terrain = this.terrain.get(pt) ?? this.baseTerrain
      const entities = this.getRenderable().filter(e => e.position.pt === pt)

      // const entities = this.get(Comp<'position'>, )
      callback(pt, [terrain, ...entities] as EntityR[])
    })
  }

  being(key: EntityKey, pt: Point) {
    const being = window.game.entity.spawn(key, pt)
    this.entities.push(being)
    this.turnQueue.add(being.eID, true)
  }

  feature(key: EntityKey, pt: Point) {
    const feature = window.game.entity.spawn(key, pt)
    this.entities.push(feature)
  }

  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const results = this.entities.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
    return results
  }

  here(pt: Point): [Entity, Entity[]] {
    return [this.terrainHere(pt), this.entities.filter(e => e.position && e.position.pt === pt)]
  }

  terrainHere(pt: Point) {
    return this.terrain.get(pt) ?? this.baseTerrain
  }

  getRenderable() {
    return this.entities.filter(e => 'form' in e && 'position' in e) as EntityR[]
  }

  getByID(eID: number) {
    return this.entities.find(e => e.eID === eID)
  }

  modify(entity: Entity, c: Components) {
    const e = { ...entity, ...c }
    const index = this.entities.findIndex(e => e === entity)
    if (index < 0) throw new Error('Unable to locate entity to modify')
    this.entities[index] = e
  }
}

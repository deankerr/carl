import { Point } from '../Model/Point'
import { Entity, EntityKey } from './Entity'

export class Region {
  terrain = new Map<Point, Entity>()
  entities: Entity[] = []
  constructor(readonly width: number, readonly height: number, readonly baseTerrain: EntityKey) {
    window.game.point.grid(width, height, pt => {
      this.terrain.set(pt, window.game.entity.spawn(baseTerrain, pt))
    })
  }

  // at(pt: Point) {
  //   return this.baseTerrain
  // }

  render(callback: (pt: Point, entities: Entity[]) => unknown) {
    window.game.point.grid(this.width, this.height, pt => {
      const terrain = this.terrain.get(pt) ?? window.game.entity.spawn(this.baseTerrain, pt)

      callback(pt, [terrain])
    })
  }

  being(key: EntityKey, pt: Point) {
    const being = window.game.entity.spawn(key, pt)
    this.entities.push(being)
  }

  feature(key: EntityKey, pt: Point) {
    const feature = window.game.entity.spawn(key, pt)
    this.entities.push(feature)
  }
}

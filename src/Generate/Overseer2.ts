import { Entity, EntityPool, Region } from '../Core'
import { Point } from '../Model/Point'
import { BeingKey, FeatureKey, TerrainKey } from '../Templates'

export class Overseer2 {
  region: Region
  pool: EntityPool

  mutations: Mutation[] = []
  current = mutation()

  constructor(region: Region) {
    this.region = region
    this.pool = region.pool
  }

  snapshot(msg: string) {
    this.current.message = msg
    this.mutations.push(this.current)
    this.current = mutation()
  }

  terrain(pt: Point, terrain: TerrainKey) {
    const t = this.pool.symbolic(terrain)
    this.current.terrain.set(pt, t)
    this.region.terrainMap.set(pt, t)
  }

  feature(pt: Point, feature: FeatureKey) {
    const f = this.pool.spawn(feature, pt)
    this.current.features.set(pt, f)
  }

  being(pt: Point, being: BeingKey) {
    const b = this.pool.spawn(being, pt)
    this.current.features.set(pt, b)
  }
}

type Mutation = {
  terrain: Map<Point, Entity>
  features: Map<Point, Entity>
  beings: Map<Point, Entity>
  message: string
}

function mutation(): Mutation {
  return {
    terrain: new Map<Point, Entity>(),
    features: new Map<Point, Entity>(),
    beings: new Map<Point, Entity>(),
    message: '',
  }
}

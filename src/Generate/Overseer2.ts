/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, EntityKey, EntityPool, Region } from '../Core'
import { Point } from '../Model/Point'
import { BeingKey, FeatureKey, TerrainKey } from '../Templates'

export class Overseer2 {
  region: Region
  pool: EntityPool

  mutations: Mutation[] = []
  current = mutation()

  // stores the latest features/beings, are added to the region at the end
  final = mutation()

  constructor(region: Region) {
    this.region = region
    this.pool = region.pool
  }

  snapshot(msg: string) {
    this.current.message = msg
    this.mutations.push(this.current)
    this.current = mutation()
  }

  terrain(pt: Point, terrain: EntityKey) {
    if (!this.region.inBounds(pt)) return
    const t = this.pool.symbolic(terrain)
    this.region.terrainMap.set(pt, t)
    this.current.terrain.set(pt, terrain)
  }

  feature(pt: Point, feature: FeatureKey) {
    if (!this.region.inBounds(pt)) return
    this.current.features.set(pt, feature)
    this.final.features.set(pt, feature)
    this.terrain(pt, 'void') // clear terrain
  }

  being(pt: Point, being: BeingKey) {
    if (!this.region.inBounds(pt)) return
    this.current.beings.set(pt, being)
    this.final.beings.set(pt, being)
    this.terrain(pt, 'void') // clear terrain
  }

  // realify actual entities
  finalize() {
    this.final.features.forEach((f, k) => {
      this.region.createEntity(f, k)
    })
    this.final.beings.forEach((b, k) => {
      this.region.createEntity(b, k)
    })
  }
}

type Mutation = {
  terrain: Map<Point, EntityKey>
  features: Map<Point, EntityKey>
  beings: Map<Point, EntityKey>
  message: string
}

function mutation(): Mutation {
  return {
    terrain: new Map<Point, EntityKey>(),
    features: new Map<Point, EntityKey>(),
    beings: new Map<Point, EntityKey>(),
    message: '',
  }
}

import { EntityKey, EntityPool, Region } from '../Core'
import { Visualizer } from '../Core/Visualizer'
import { Point } from '../Model/Point'
import { BeingKey, FeatureKey } from '../Templates'

export class Overseer2 {
  region: Region
  pool: EntityPool

  mutations: GenHistory[] = []
  current = genHistory()

  // stores the latest features/beings, are added to the region at the end
  final = genHistory()

  time: number
  constructor(region: Region) {
    this.time = Date.now()
    this.region = region
    this.pool = region.pool
    this.snapshot('init')
  }

  snapshot(msg: string) {
    this.current.message = msg
    this.mutations.push(this.current)
    this.current = genHistory()
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

    this.region.visualizer = new Visualizer(this.region, this.mutations)
    console.log(`O2 ${Date.now() - this.time}ms`, this)
  }

  module(): O2Module {
    const terrain = (type: EntityKey) => (pt: Point) => this.terrain(pt, type)
    const feature = (type: FeatureKey) => (pt: Point) => this.feature(pt, type)
    const being = (type: BeingKey) => (pt: Point) => this.being(pt, type)
    const snap = (msg: string) => () => this.snapshot(msg)

    return {
      region: this.region,
      terrain: terrain.bind(this),
      feature: feature.bind(this),
      being: being.bind(this),
      snap: snap.bind(this),
    }
  }
}

export type O2Module = {
  region: Region
  terrain: (type: EntityKey) => (pt: Point) => void
  feature: (type: FeatureKey) => (pt: Point) => void
  being: (type: BeingKey) => (pt: Point) => void
  snap: (msg: string) => () => void
}

export type GenHistory = {
  terrain: Map<Point, EntityKey>
  features: Map<Point, EntityKey>
  beings: Map<Point, EntityKey>
  message: string
}

export function genHistory(): GenHistory {
  return {
    terrain: new Map<Point, EntityKey>(),
    features: new Map<Point, EntityKey>(),
    beings: new Map<Point, EntityKey>(),
    message: '',
  }
}

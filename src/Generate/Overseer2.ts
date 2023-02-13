import { BeingKey, EntityKey, EntityPool, FeatureKey, Region, TerrainKey } from '../Core'
import { Visualizer } from '../Core/Visualizer'
import * as Templates from '../Templates'
import { point, Point } from '../Model/Point'

export class Overseer2 {
  region: Region
  pool: EntityPool

  mutations: GenHistory[] = []
  current = genHistory()

  // stores the latest features/beings, are added to the region at the end
  final = genHistory()

  timeStarted: number
  timeEnded = 0

  constructor(region: Region) {
    this.timeStarted = Date.now()
    this.region = region
    this.pool = region.pool
    this.snapshot('init')
  }

  snapshot(msg: string) {
    this.current.message = msg
    this.mutations.push(this.current)
    this.current = genHistory()
  }

  terrain(pt: Point, terrain: TerrainKey) {
    if (!this.region.inBounds(pt)) return

    this.region.createTerrain(pt, terrain)
    this.current.terrain.set(pt, terrain)
  }

  feature(pt: Point, feature: FeatureKey) {
    if (!this.region.inBounds(pt)) return
    this.current.features.set(pt, feature)
    this.final.features.set(pt, feature)
    if (feature !== '[clear]') {
      this.region.createEntity(pt, feature)
    }
  }

  being(pt: Point, being: BeingKey) {
    if (!this.region.inBounds(pt)) return
    this.current.beings.set(pt, being)
    this.final.beings.set(pt, being)
    this.region.createEntity(pt, being)
  }

  add(pt: Point, key: EntityKey) {
    if (!this.region.inBounds(pt)) return
    const e = this.pool.symbolic(key)
    if (e.terrain) return this.terrain(pt, key as TerrainKey)
    if (e.feature) return this.feature(pt, key as FeatureKey)
    if (e.being) return this.being(pt, key as BeingKey)
  }

  // realify actual entities
  finalize() {
    this.final.features.forEach((key, pt) => {
      if (key === '[clear]') {
        const features = this.region.get('position').filter(e => e.position === pt)
        features.forEach(f => this.region.destroyEntity(f))
      } else {
        this.region.createEntity(pt, key)
      }
    })
    this.final.beings.forEach((key, pt) => {
      this.region.createEntity(pt, key)
    })

    this.region.evaluateTerrainVariants()
    this.region.visualizer = new Visualizer(this.region, this.mutations)
    const timeTaken = Date.now() - this.timeStarted
    this.mutations[0].message = timeTaken.toString()
    console.log(`O2 ${timeTaken}ms`, this)
  }

  module(): O2Module {
    const terrain = (type: TerrainKey) => (pt: Point) => this.terrain(pt, type)
    const feature = (type: FeatureKey) => (pt: Point) => this.feature(pt, type)
    const being = (type: BeingKey) => (pt: Point) => this.being(pt, type)
    const snap = (msg: string) => () => this.snapshot(msg)

    return {
      region: this.region,
      terrain: terrain.bind(this),
      feature: feature.bind(this),
      being: being.bind(this),
      snap: snap.bind(this),
      snapshot: this.snapshot.bind(this),
    }
  }
}

export type O2Module = {
  region: Region
  terrain: (type: TerrainKey) => (pt: Point) => void
  feature: (type: FeatureKey) => (pt: Point) => void
  being: (type: BeingKey) => (pt: Point) => void
  snap: (msg: string) => () => void
  snapshot: Overseer2['snapshot']
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

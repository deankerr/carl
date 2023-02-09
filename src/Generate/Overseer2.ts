import { EntityKey, EntityPool, Region } from '../Core'
import { Visualizer } from '../Core/Visualizer'
import { tileVariant } from '../lib/tilemap'
import { pick, rnd } from '../lib/util'
import { point, Point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { BeingKey, FeatureKey } from '../Templates'

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

    // add faces
    Rect.at(point(0, 0), this.region.width, this.region.height).traverse(pt => {
      if (this.region.terrainAt(pt).blocksMovement) {
        if (!this.region.terrainAt(pt.add(0, 1)).blocksMovement) this.terrain(pt, 'caveWall')
        else this.terrain(pt, 'caveSolid')
      }

      if (this.region.terrainAt(pt).label.startsWith('water')) {
        if (!this.region.terrainAt(pt.add(0, -1)).label.startsWith('water'))
          this.terrain(pt, 'waterFace')
        else this.terrain(pt, 'water')
      }

      if (this.region.terrainAt(pt).label.startsWith('sand')) {
        if (!this.region.terrainAt(pt.add(0, -1)).label.startsWith('sand'))
          this.terrain(pt, 'sandFace')
        else this.terrain(pt, 'sand')
      }
    })

    this.mutations.push(this.current)
    this.current = genHistory()
  }

  terrain(pt: Point, terrain: EntityKey) {
    if (!this.region.inBounds(pt)) return
    const variant = tileVariant(terrain)

    const t = this.pool.symbolic(variant)
    this.region.terrainMap.set(pt, t)
    this.current.terrain.set(pt, variant)
  }

  feature(pt: Point, feature: FeatureKey) {
    if (!this.region.inBounds(pt)) return
    this.current.features.set(pt, feature)
    this.final.features.set(pt, feature)
    // this.terrain(pt, 'ground') // clear terrain
  }

  being(pt: Point, being: BeingKey) {
    if (!this.region.inBounds(pt)) return
    this.current.beings.set(pt, being)
    this.final.beings.set(pt, being)
    // this.terrain(pt, 'ground') // clear terrain
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

    this.region.visualizer = new Visualizer(this.region, this.mutations)
    const timeTaken = Date.now() - this.timeStarted
    this.mutations[0].message = timeTaken.toString()
    console.log(`O2 ${timeTaken}ms`, this)
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
      snapshot: this.snapshot.bind(this),
    }
  }
}

export type O2Module = {
  region: Region
  terrain: (type: EntityKey) => (pt: Point) => void
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

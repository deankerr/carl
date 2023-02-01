import { Entity, EntityKey, EntityPool, TerrainKey } from '../Core/Entity'
import { Region } from '../Core/Region'
import { rnd } from '../lib/util'
import { Point, point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'

export type Mutation = [Map<Point, Entity>, Entity[]]

export class Overseer {
  current: Region
  domainConnections = new Map<string, string>()

  history: Mutation[] = []

  // compatibility
  grid = {
    rndPt: () => {
      return point(rnd(0, this.width - 1), rnd(0, this.height - 1))
    },
  }

  constructor(
    readonly width: number,
    readonly height: number,
    readonly pool: EntityPool,
    readonly initial: TerrainKey = 'void'
  ) {
    this.current = new Region(width, height, pool)
  }

  mutate() {
    const mutation: Mutation = [new Map([...this.current.terrainMap]), [...this.current.entities]]
    this.history.push(mutation)

    const mutator = new Mutator(this.current)
    return mutator
  }
}

export class Mutator {
  constructor(readonly current: Region) {}

  setT(pt: Point | Rect, t: TerrainKey) {
    if (pt instanceof Rect) {
      pt.toPts().forEach(pt => this.setT(pt, t))
      return
    }

    this.current.createTerrain(t, pt)
  }

  setE(pt: Point | Rect, e: EntityKey) {
    if (pt instanceof Rect) {
      pt.toPts().forEach(pt => this.setE(pt, e))
      return
    }

    this.current.createEntity(e, pt)
  }

  query(pt: Point) {
    return this.current.terrainAt(pt)
  }
}

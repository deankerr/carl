import { Entity } from '../Core/Entity'
import { Grid } from '../Model/Grid'
import { Point, StrPt } from '../Model/Point'
import { Terrain } from '../Templates'

export type Mutation = Map<string, Entity>

export class Overseer {
  internal: Grid<Entity>
  main: Mutation = new Map()
  mutations: Mutation[] = []
  features: Mutation = new Map()

  constructor(readonly width: number, readonly height: number, readonly initial = Terrain.void) {
    this.internal = Grid.fill(width, height, initial)
  }

  mutate(m?: Mutation | Mutation[]) {
    const mutation: Mutation = new Map()
    this.mutations.push(mutation)
    const mutator = new Mutator(this.main, mutation)

    if (m) {
      if (Array.isArray(m)) {
        m[0].forEach((e, pt) => mutator.set(pt, e))
        m[1].forEach((f, k) => this.features.set(k, f))
      } else {
        m.forEach((e, pt) => mutator.set(pt, e))
      }
    }

    return mutator
  }

  construct() {
    const result = Grid.fill(this.width, this.height, this.initial)
    for (const [pt, t] of this.main) result.set(StrPt(pt), t)
    return result
  }

  // playback
  index = 0
  current() {
    return this.internal
  }

  next() {
    if (this.index < this.mutations.length) {
      for (const [pt, t] of this.mutations[this.index]) this.internal.set(StrPt(pt), t)
      this.index++
      return true
    } else return false
  }

  reset() {
    this.index = 0
    this.internal.each(pt => this.internal.set(pt, this.initial))
    return this.internal
  }
}

class Mutator {
  constructor(private current: Mutation, private mutator: Mutation) {}

  set(setPt: Point | string, e: Entity) {
    const pts = typeof setPt === 'string' ? setPt : setPt.s
    if (this.current.get(pts) === e) return
    this.current.set(pts, e)
    this.mutator.set(pts, e)
  }
}

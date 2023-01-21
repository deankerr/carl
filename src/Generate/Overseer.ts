import { Entity } from '../Core/Entity'
import { Grid } from '../Model/Grid'
import { Point, StrPt } from '../Model/Point'
import { Terrain } from '../Templates'

export type Mutation = Map<string, Entity>

export class Overseer {
  internal: Grid<Entity>
  main: Mutation = new Map()
  mutations: Mutation[] = []

  constructor(readonly width: number, readonly height: number, readonly initial = Terrain.void) {
    this.internal = Grid.fill(width, height, initial)
  }

  mutate() {
    const mutation: Mutation = new Map()
    this.mutations.push(mutation)
    return new Mutator(this.main, mutation)
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
    if (this.index + 1 < this.mutations.length) {
      for (const [pt, t] of this.mutations[++this.index]) this.internal.set(StrPt(pt), t)
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

  set(pt: Point, e: Entity) {
    if (this.current.get(pt.s) === e) return
    this.current.set(pt.s, e)
    this.mutator.set(pt.s, e)
  }
}

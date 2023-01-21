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
    for (const [pt, t] of this.main) this.internal.set(StrPt(pt), t)
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

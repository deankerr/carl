import { EntityTemplate } from '../Core/Entity'
import { Grid } from '../Model/Grid'
import { Point, StrPt } from '../Model/Point'
import { Terrain, TerrainTemplate } from '../Templates'

export type Mutation = Map<string, EntityTemplate>

export class Overseer {
  internal: Grid<TerrainTemplate>
  terrain = new Map<string, TerrainTemplate>()
  mutations: Mutation[] = []
  entityMutations: Mutation[] = []
  visualMutations: Mutation[] = []

  constructor(readonly width: number, readonly height: number, readonly initial = Terrain.void) {
    this.internal = Grid.fill(width, height, initial)
  }

  mutate() {
    const mutation: Mutation = new Map()
    const entityMutations: Mutation = new Map()
    this.mutations.push(mutation)
    this.entityMutations.push(entityMutations)
    const visual = new Map()
    this.visualMutations.push(visual)
    const mutator = new Mutator(this.terrain, mutation, entityMutations, visual)
    return mutator
  }

  construct() {
    const result = Grid.fill(this.width, this.height, this.initial)
    for (const [pt, t] of this.terrain) result.set(StrPt(pt), t)
    return result
  }

  rndPt() {
    return this.internal.rndPt()
  }

  // playback
  index = 0
  current() {
    return this.internal
  }

  next() {
    if (this.index + 1 < this.mutations.length) {
      this.index++
      for (const [pt, t] of this.mutations[this.index]) this.internal.set(StrPt(pt), t)
      return [this.entityMutations[this.index], this.visualMutations[this.index]]
    } else return false
  }

  last() {
    this.index = this.mutations.length - 1
    for (const [pt, t] of this.terrain) this.internal.set(StrPt(pt), t)
    return [...this.entityMutations, ...this.visualMutations]
  }

  reset() {
    this.index = 0
    this.internal.each(pt => this.internal.set(pt, this.initial))
    return this.internal
  }
}

export class Mutator {
  constructor(
    private main: Mutation,
    private terrain: Mutation,
    private entityMutator: Mutation,
    private visualMutator: Mutation
  ) {}

  set(setPt: Point | string, e: EntityTemplate) {
    const pts = typeof setPt === 'string' ? setPt : setPt.s
    if (this.main.get(pts) === e) return
    if (Object.values(Terrain).includes(e)) {
      this.main.set(pts, e)
      this.terrain.set(pts, e)
    } else this.entityMutator.set(pts, e)
  }

  visual(setPt: Point, e: EntityTemplate) {
    const pts = typeof setPt === 'string' ? setPt : setPt.s
    this.visualMutator.set(pts, e)
  }
}

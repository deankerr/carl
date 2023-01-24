import { EntityTemplate } from '../Core/Entity'
import { Grid } from '../Model/Grid'
import { Point, StrPt } from '../Model/Point'
import { Terrain, TerrainTemplate } from '../Templates'

export type Mutation = Map<string, EntityTemplate>

export class Overseer {
  grid: Grid<TerrainTemplate>
  mutators: Mutator[] = []

  constructor(readonly width: number, readonly height: number, readonly initial = Terrain.void) {
    this.grid = Grid.fill(width, height, initial)

    const initMutator = new Mutator(this.grid)
    this.grid.each((pt, t) => initMutator.terrain.set(pt.s, t))
    this.mutators.push(initMutator)
  }

  mutate() {
    const mutator = new Mutator(this.grid)
    this.mutators.push(mutator)
    return mutator
  }

  replay() {
    return Grid.fill(this.width, this.height, this.initial)
  }
}

export class Mutator {
  terrain: Mutation = new Map()
  entities: Mutation = new Map()
  markers: Mutation = new Map()
  constructor(private grid: Grid<TerrainTemplate>) {}

  set(setPt: Point | string, e: EntityTemplate) {
    const pt = typeof setPt === 'string' ? StrPt(setPt) : setPt
    if (this.grid.get(pt) === e) return
    if (Object.values(Terrain).includes(e)) {
      this.grid.set(pt, e)
      this.terrain.set(pt.s, e)
    } else if (e.id.includes('debug')) this.markers.set(pt.s, e)
    else this.entities.set(pt.s, e)
  }
}

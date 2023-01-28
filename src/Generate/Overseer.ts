import { Entity, EntityTemplate } from '../Core/Entity'
import { Grid } from '../Model/Grid'
import { Level2 } from '../Model/Level'
import { Point, PointMan, strToPt } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { Features, Terrain, TerrainTemplate } from '../Templates'

export type Mutation = Map<string, EntityTemplate>

export class Overseer {
  grid: Grid<TerrainTemplate>
  mutators: Mutator[] = []
  domainConnections = new Map<string, string>()

  constructor(readonly width: number, readonly height: number, readonly initial = Terrain.void) {
    this.grid = Grid.fill(width, height, initial)

    const initMutator = new Mutator(this.grid)
    this.grid.each((pt, t) => initMutator.divulge().terrain.set(pt.s, t))
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
  private terrain: Mutation = new Map()
  private entities: Mutation = new Map()
  private markers: Mutation = new Map()
  private clearMarkers = false
  constructor(private grid: Grid<TerrainTemplate>) {}

  set(setPt: Point | string | Rect, e: EntityTemplate) {
    if (setPt instanceof Rect) {
      setPt.toPts().forEach(pt => this.set(pt, e))
      return
    }
    const pt = typeof setPt === 'string' ? strToPt(setPt) : setPt
    if (this.grid.get(pt) === e) return
    if (Object.values(Terrain).includes(e)) {
      this.grid.set(pt, e)
      this.terrain.set(pt.s, e)
    } else if (e.id.includes('debug')) this.markers.set(pt.s, e)
    else this.entities.set(pt.s, e)
  }

  mark(pt: Point | Rect) {
    if ('s' in pt) {
      this.markers.set(pt.s, Features.debugMarker)
    } else {
      pt.toPts().forEach(pt => this.markers.set(pt.s, Features.debugMarker))
    }
  }

  clear() {
    this.clearMarkers = true
  }

  divulge() {
    return { terrain: this.terrain, entities: this.entities, markers: this.markers, clearMarkers: this.clearMarkers }
  }

  query(pt: Point) {
    return this.grid.get(pt)
  }
}

const pt = PointMan()
export class Overseer2 {
  main: Level2
  constructor(width: number, height: number, initialTerrain: Entity) {
    this.main = new Level2(width, height)
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        // this.main.terrain.set(pt(xi, yi), initialTerrain)
      }
    }
  }
}

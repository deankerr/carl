/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, EntityLabel, EntityPool, TerrainLabel } from '../Core/Entity'
import { Region } from '../Core/Region'
import { rnd } from '../lib/util'
import { Point, strToPt } from '../Model/Point'
import { Rect } from '../Model/Rectangle'

export type Mutation = [Map<Point, Entity>, Entity[]]

export class Overseer {
  current: Region
  domainConnections = new Map<string, string>()

  history: Mutation[] = []

  // compatibility
  grid = {
    rndPt: () => {
      return window.game.point.pt(rnd(0, this.width - 1), rnd(0, this.height - 1))
    },
  }

  constructor(
    readonly width: number,
    readonly height: number,
    readonly pool: EntityPool,
    readonly initial: TerrainLabel = 'void'
  ) {
    this.current = new Region(width, height, pool, initial)
  }

  mutate() {
    const mutation: Mutation = [new Map([...this.current.terrainMap]), [...this.current.entities]]
    this.history.push(mutation)

    const mutator = new Mutator(this.current)
    return mutator
  }

  // replay() {
  //   return Grid.fill(this.width, this.height, this.initial)
  // }
}

export class Mutator {
  constructor(readonly current: Region) {}

  setT(setPt: Point | string | Rect, t: TerrainLabel) {
    if (setPt instanceof Rect) {
      setPt.toPts().forEach(pt => this.setT(pt, t))
      return
    }
    const ptOLD = typeof setPt === 'string' ? strToPt(setPt) : setPt
    const pt = window.game.point.pt(ptOLD.x, ptOLD.y)

    this.current.createTerrain(t, pt)
  }

  setE(setPt: Point | string | Rect, e: EntityLabel) {
    if (setPt instanceof Rect) {
      setPt.toPts().forEach(pt => this.setE(pt, e))
      return
    }
    const ptOLD = typeof setPt === 'string' ? strToPt(setPt) : setPt
    const pt = window.game.point.pt(ptOLD.x, ptOLD.y)

    this.current.createEntity(e, pt)
  }

  mark(pt: Point | Rect) {
    // if ('s' in pt) {
    //   this.markers.set(pt.s, Features.debugMarker)
    // } else {
    //   pt.toPts().forEach(pt => this.markers.set(pt.s, Features.debugMarker))
    // }
  }

  clear() {
    // this.clearMarkers = true
  }

  divulge() {
    // return { terrain: this.terrain, entities: this.entities, markers: this.markers, clearMarkers: this.clearMarkers }
  }

  query(pt: Point) {
    return this.current.terrainAt(pt)
  }
}
// export type Mutation = Map<string, EntityTemplate>

// export class Overseer {
//   grid: Grid<TerrainTemplate>
//   mutators: Mutator[] = []
//   domainConnections = new Map<string, string>()

//   constructor(readonly width: number, readonly height: number, readonly initial = Terrain.void) {
//     this.grid = Grid.fill(width, height, initial)

//     const initMutator = new Mutator(this.grid)
//     this.grid.each((pt, t) => initMutator.divulge().terrain.set(pt.s, t))
//     this.mutators.push(initMutator)
//   }

//   mutate() {
//     const mutator = new Mutator(this.grid)
//     this.mutators.push(mutator)
//     return mutator
//   }

//   replay() {
//     return Grid.fill(this.width, this.height, this.initial)
//   }
// }

// export class Mutator {
//   private terrain: Mutation = new Map()
//   private entities: Mutation = new Map()
//   private markers: Mutation = new Map()
//   private clearMarkers = false
//   constructor(private grid: Grid<TerrainTemplate>) {}

//   set(setPt: Point | string | Rect, e: EntityTemplate) {
//     if (setPt instanceof Rect) {
//       setPt.toPts().forEach(pt => this.set(pt, e))
//       return
//     }
//     const pt = typeof setPt === 'string' ? strToPt(setPt) : setPt
//     if (this.grid.get(pt) === e) return
//     if (Object.values(Terrain).includes(e)) {
//       this.grid.set(pt, e)
//       this.terrain.set(pt.s, e)
//     } else if (e.id.includes('debug')) this.markers.set(pt.s, e)
//     else this.entities.set(pt.s, e)
//   }

//   mark(pt: Point | Rect) {
//     if ('s' in pt) {
//       this.markers.set(pt.s, Features.debugMarker)
//     } else {
//       pt.toPts().forEach(pt => this.markers.set(pt.s, Features.debugMarker))
//     }
//   }

//   clear() {
//     this.clearMarkers = true
//   }

//   divulge() {
//     return { terrain: this.terrain, entities: this.entities, markers: this.markers, clearMarkers: this.clearMarkers }
//   }

//   query(pt: Point) {
//     return this.grid.get(pt)
//   }
// }

// import * as ROT from 'rot-js'
import { Entity, EntityTemplate } from '../../Core/Entity'
import { repeat, rnd } from '../../lib/util'
import { Point, Pt } from '../../Model/Point'
import { Features, Terrain } from '../../Templates'
import { Mutator } from '../Overseer'
import { Rect } from '../Rectangle'

export class Room {
  rect: Rect
  map = new Map<string, Entity | EntityTemplate>()
  feature = new Map<string, Entity>()

  constructor(width: number, height: number) {
    this.rect = Rect.atC(Pt(0, 0), width, height)
  }

  walls(crackedPerc = 25) {
    this.rect.traverse((pt, edge) => {
      if (edge) {
        this.map.set(pt.s, rnd(100) < crackedPerc ? Terrain.crackedWall : Terrain.wall)
      }
    })
    return this
  }

  floor(type: Entity) {
    this.rect.traverse((pt, edge) => {
      if (!edge) {
        this.map.set(pt.s, type)
      }
    })
    return this
  }

  degradedFloor(type: Entity, scale: number) {
    const inner = this.rect.scale(scale)
    inner.traverse((pt, edge) => {
      if (edge) {
        rnd(1) && this.map.set(pt.s, type)
      } else rnd(16) && this.map.set(pt.s, type)
    })
    return this
  }

  door(beneath: Entity) {
    const pt = this.rect.rndEdgePt().s
    this.map.set(pt, beneath)
    this.feature.set(pt, Features.door)
    return this
  }

  crumble(amount = 3) {
    repeat(amount, () => {
      const pt = this.rect.rndEdgePt()
      this.map.delete(pt.s)
      pt.neighbors().forEach(npt => {
        if (this.map.get(npt.s) === Terrain.wall) {
          // if wall, delete or crack
          if (rnd(0)) this.map.delete(npt.s)
          else this.map.set(npt.s, Terrain.crackedWall)
        } else {
          // if not, small chance to crack
          if (!rnd(4)) this.map.set(npt.s, Terrain.crackedWall)
        }
      })
    })
    return this
  }

  place(pt: Point, mutator: Mutator) {
    // const placed = new Map<string, Entity>()
    for (const [pts, e] of this.map) {
      console.log('hi')
      mutator.set(pt.add(pts).s, e)
    }

    // const placedFeatures = new Map<string, Entity>()
    // for (const [pts, e] of this.feature) {
    //   placedFeatures.set(pts, e)
    // }

    // return [placed, placedFeatures]
  }
}

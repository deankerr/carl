// import * as ROT from 'rot-js'
import { Entity } from '../../Core/Entity'
import { repeat, rnd } from '../../lib/util'
import { Point, Pt } from '../../Model/Point'
import { Features, Terrain } from '../../Templates'
import { Rect } from '../Rectangle'

export type RoomOpts = {
  wall?: Entity
  floor?: Entity | 'none'
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

const defaultOpts = {
  wall: Terrain.wall,
  floor: Terrain.path,
  minWidth: 5,
  minHeight: 5,
  maxWidth: 11,
  maxHeight: 11,
}

export class Room {
  rect: Rect
  wall: Entity
  floor: Entity | 'none'
  map = new Map<string, Entity>()
  feature = new Map<string, Entity>()

  constructor(setOpts: RoomOpts) {
    const opts = { ...defaultOpts, ...setOpts }
    this.rect = Rect.atC(Pt(0, 0), rnd(opts.minWidth, opts.maxWidth), rnd(opts.minHeight, opts.maxHeight))
    this.wall = opts.wall
    this.floor = opts.floor
    this.rect.traverse((pt, edge) => {
      if (edge) this.map.set(pt.s, rnd(5) < 5 ? this.wall : Terrain.crackedWall)
      else if (this.floor !== 'none') this.map.set(pt.s, this.floor)
    })
  }

  door() {
    const pt = this.rect.rndEdgePt().s
    if (this.floor !== 'none') this.map.set(pt, this.floor)
    else this.map.delete(pt)
    this.feature.set(pt, Features.door)
    return this
  }

  crumble(amount = 3) {
    repeat(amount, () => {
      const pt = this.rect.rndEdgePt()
      this.map.delete(pt.s)
      pt.neighbors().forEach(npt => {
        const r = rnd(3)
        if (this.map.get(npt.s) === this.wall) {
          // if wall, delete or crack
          if (r <= 1) this.map.delete(npt.s)
          else this.map.set(npt.s, Terrain.crackedWall)
        } else {
          // if not, small chance to crack
          if (!r) this.map.set(npt.s, Terrain.crackedWall)
        }
      })
    })
    return this
  }

  place(pt: Point) {
    const placed = new Map<string, Entity>()
    for (const [pts, e] of this.map) {
      placed.set(pt.add(pts).s, e)
    }

    const placedFeatures = new Map<string, Entity>()
    for (const [pts, e] of this.feature) {
      placedFeatures.set(pts, e)
    }

    return [placed, placedFeatures]
  }
}

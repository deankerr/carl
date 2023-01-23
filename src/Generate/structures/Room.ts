/* eslint-disable @typescript-eslint/no-unused-vars */
// import * as ROT from 'rot-js'
import { EntityTemplate } from '../../Core/Entity'
import { repeat, rnd } from '../../lib/util'
import { Point, Pt, StrPt } from '../../Model/Point'
import { Features, Terrain } from '../../Templates'
import { Mutator } from '../Overseer'
import { Rect } from '../Rectangle'

export function Room(width: number, height: number) {
  return new RoomBuilder(width, height)
}
export class RoomBuilder {
  rect: Rect
  terrain = new Map<string, EntityTemplate>()
  entities = new Map<Point, EntityTemplate>()
  annexes = new Map<Point, RoomBuilder>()

  constructor(width: number, height: number) {
    this.rect = Rect.atC(Pt(0, 0), width, height)
  }

  walls(crackedPerc = 25) {
    this.rect.traverse((pt, edge) => {
      if (edge) {
        this.terrain.set(pt.s, rnd(100) < crackedPerc ? Terrain.crackedWall : Terrain.wall)
      }
    })
    return this
  }

  floor(type: EntityTemplate) {
    this.rect.traverse((pt, edge) => {
      if (!edge) {
        this.terrain.set(pt.s, type)
      }
    })
    return this
  }

  degradedFloor(type: EntityTemplate, scale: number) {
    const inner = this.rect.scale(scale)
    inner.traverse((pt, edge) => {
      if (edge) {
        rnd(1) && this.terrain.set(pt.s, type)
      } else rnd(16) && this.terrain.set(pt.s, type)
    })
    return this
  }

  door(beneath: EntityTemplate, at?: Point) {
    const pt = at ?? this.rect.rndEdgePt()
    this.terrain.set(pt.s, beneath)
    this.entities.set(pt, Features.door)
    return this
  }

  crumble(amount = 3) {
    repeat(amount, () => {
      const pt = this.rect.rndEdgePt()
      this.terrain.delete(pt.s)
      pt.neighbors().forEach(npt => {
        if (this.terrain.get(npt.s) === Terrain.wall) {
          // if wall, delete or crack
          if (rnd(0)) this.terrain.delete(npt.s)
          else this.terrain.set(npt.s, Terrain.crackedWall)
        } else {
          // if not, small chance to crack
          if (!rnd(4)) this.terrain.set(npt.s, Terrain.crackedWall)
        }
      })
    })
    return this
  }

  place(at: Point, mutator: Mutator) {
    for (const [pts, e] of this.terrain) mutator.set(at.add(pts).s, e)
    for (const [pt, room] of this.annexes) room.place(at.add(pt), mutator)

    for (const [pt, e] of this.entities) {
      const ePt = at.add(pt)
      console.log('eplace', mutator.terrain.has(ePt.s), mutator.entityMutator.has(ePt.s))
      if (!mutator.terrain.has(ePt.s) && !mutator.entityMutator.has(ePt.s)) mutator.set(ePt, e)
    }
  }

  annex(relative: Point, width: number, height: number) {
    const room = Room(width, height)
    this.annexes.set(relative, room)
    return room
  }
}

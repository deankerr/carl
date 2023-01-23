/* eslint-disable @typescript-eslint/no-unused-vars */
// import * as ROT from 'rot-js'
import { EntityTemplate } from '../../Core/Entity'
import { half, pick, repeat, rnd, rndO } from '../../lib/util'
import { Point, Pt, StrPt } from '../../Model/Point'
import { Features, Terrain } from '../../Templates'
import { Mutator } from '../Overseer'
import { Rect } from '../Rectangle'

export function Room(width: number, height: number) {
  return new RoomBuilder(Rect.atC(Pt(0, 0), width, height))
}
export class RoomBuilder {
  rect: Rect

  terrain = new Map<string, EntityTemplate>()
  entities = new Map<Point, EntityTemplate>()
  annexes: RoomBuilder[] = []

  constructor(rect: Rect) {
    this.rect = rect
  }

  walls(crackedPerc = 0) {
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
    console.log('inner:', inner)
    inner.traverse((pt, edge) => {
      if (edge) {
        rnd(1) && this.terrain.set(pt.s, type)
      } else rnd(16) && this.terrain.set(pt.s, type)
    })
    return this
  }

  checkedFloor(type: EntityTemplate) {
    this.rect.scale(-1).traverse(pt => {
      if (pt.x % 2 && pt.y % 2) this.terrain.set(pt.s, type)
    })
    return this
  }

  door(beneath: EntityTemplate, at?: Point) {
    const pt = at ?? this.rect.rndEdgePt()
    this.terrain.set(pt.s, beneath)
    this.entities.set(pt, Features.door)
    return this
  }

  add(feature: EntityTemplate, at?: Point) {
    const pt = at ?? this.rect.scale(-1).rndPt()
    this.entities.set(pt, feature)
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
    for (const room of this.annexes) room.place(at, mutator)

    // for (const [pt, e] of this.entities) {
    //   const ePt = at.add(pt)
    //   console.log('eplace', mutator.terrain.has(ePt.s), mutator.entityMutator.has(ePt.s))
    //   if (!mutator.terrain.has(ePt.s) && !mutator.entityMutator.has(ePt.s)) mutator.set(ePt, e)
    // }
    for (const [pt, e] of this.entities) mutator.set(at.add(pt), e)
  }

  externalAnnex(width: number, height: number) {
    let rect: Rect | undefined
    repeat(1000, () => {
      // choose direction
      const dir = pick([Pt(-1, 0), Pt(0, -1), Pt(1, 0), Pt(0, 1)])
      // multiply by the combined width/height scale to position the room along a border
      const scaleBy = Pt(half(this.rect.width + width) - 1, half(this.rect.height + height) - 1)
      const pos = Pt(
        scaleBy.x * dir.x || rnd(this.rect.y, this.rect.y2),
        scaleBy.y * dir.y || rnd(this.rect.y, this.rect.y2)
      )
      // repeat until an available space is found
      const testRect = Rect.atC(pos, width, height).scale(-1)
      if (this.annexes.some(a => a.rect.intersects(testRect))) return false
      rect = Rect.atC(pos, width, height)
      return true
    })
    if (!rect) throw new Error('Unable to replace annex')
    const room = new RoomBuilder(rect)
    this.annexes.push(room)
    return room
  }

  divide() {
    const self = this.rect
    console.log('self:', self)
    const tl = Pt(self.x, self.y)
    // const dir = pick([Pt(-1, 0), Pt(0, -1), Pt(1, 0), Pt(0, 1)])
    // create a random x or y point to divide at
    const splitPt = rnd(1) ? Pt(rndO(5, self.width - 4), 0) : Pt(0, rndO(5, self.height - 4))
    console.log('split:', splitPt)
    const room1 = new RoomBuilder(Rect.at(tl, splitPt.x || self.width, splitPt.y || self.height))
    this.annexes.push(room1)
    return room1
    // const split = Pt()
  }
}

const minRoomSize = 5

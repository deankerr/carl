/* eslint-disable @typescript-eslint/no-unused-vars */
import { half, rnd } from '../../lib/util'
import { Pt, PtSet } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { Features, Marker, Terrain } from '../../Templates'
import { BSPRooms } from '../modules/BSP'
import { Mutator, Overseer } from '../Overseer'

export class Structure {
  rect: Rect // the total area which contains a structure
  sub: Structure[] = []

  innerRooms: Structure[] = []
  innerWalls: Rect[] = []

  O: Overseer
  constructor(rect: Rect, overseer: Overseer) {
    this.rect = rect
    this.O = overseer
  }

  // split the main rect into two sub rects
  bisect(variance = 0) {
    const self = this.rect //tvhis.rect.scale(-1)

    const canSplitV = self.height >= 5
    const canSpiitH = self.width >= 5
    if (!(canSplitV || canSpiitH)) return [this]
    // choose either a width or height to split at
    // true = vert, false = horiz
    const dir = true

    // get split point
    const split = dir ? rnd(self.x + 2, self.x2 - 2) : rnd(self.y + 2, self.y2 - 2)

    const splitPt1 = dir ? Pt(self.cx - 1, self.y2) : Pt(self.x2, self.cy - 1)
    const splitPt2 = dir ? Pt(self.cx + 1, self.y) : Pt(self.x, self.cy + 1)
    const sub1 = new Structure(Rect.atxy2(Pt(self.x, self.y), splitPt1), this.O)
    const sub2 = new Structure(Rect.atxy2(splitPt2, Pt(self.x2, self.y2)), this.O)

    // border region
    const splitC = dir ? Rect.at(Pt(self.cx, self.y), 1, self.height) : Rect.at(Pt(self.x, self.cy), self.width, 1)
    const sub3 = new Structure(splitC, this.O)
    this.sub.push(sub1, sub2, sub3)
    return [sub1, sub2, sub3]
  }

  inner(width: number, height: number) {
    const self = this.rect

    const x = rnd(self.x, self.x2 - width)
    const y = rnd(self.y, self.y2 - height)
    const sub = new Structure(Rect.at(Pt(x, y), width, height), this.O)
    this.sub.push(sub)

    return sub
  }

  bisectRooms() {
    const [rooms, walls] = BSPRooms(this.rect.scale(-1), { attempts: rnd(2, 5) })
    this.innerRooms = rooms.map(r => new Structure(r, this.O))
    this.innerWalls = walls
  }

  walls() {
    const self = this.rect
    const mutator = this.O.mutate()

    self.traverse((pt, edge) => {
      if (edge) mutator.set(pt, Terrain.wall)
    })
  }

  buildInnerWalls() {
    const mut = this.O.mutate()
    this.innerWalls.forEach(w => w.traverse(pt => mut.set(pt, Terrain.wall)))
  }

  connectInnerRooms() {
    const unconnected = [...this.innerRooms]
    const current = unconnected.pop()
    if (!current) throw new Error('unhandled no more unconnceted?')
    // are there any possible room connections? if not?
    // find adjacent room points
    current.mark()
    console.log(
      'this.innerWalls:',
      this.innerWalls.map(r => r.toPts())
    )
    const searchRect = current.rect.scale(1)
    const innerWallPts = this.innerWalls
      .filter(w => w.intersects(searchRect))
      .map(w => w.toPts())
      .flat()
    this.O.mutate()
    const ptSet = PtSet(...innerWallPts).toPt()
    console.log('innerWallPts:', innerWallPts)
    console.log('ptSet:', ptSet)
  }

  mark() {
    const m = this.O.mutate()
    this.rect.traverse(pt => m.set(pt, Features.debugMarker))
  }
}

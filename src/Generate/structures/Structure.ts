/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ROT from 'rot-js'
import { EntityTemplate } from '../../Core/Entity'
import { half, pick, range, rnd } from '../../lib/util'
import { Point, PointSet, Pt } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { Features, Marker, Terrain } from '../../Templates'
import { BSPRooms } from '../modules/BSP'
import { Overseer } from '../Overseer'

export class Structure {
  rect: Rect // the total area which contains a structure
  sub: Structure[] = []

  innerRooms: Structure[] = []
  innerWalls: Rect[] = []
  innerRoomConnections = new Map<Point, [Structure, Structure]>()

  O: Overseer
  label = ''

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

  center(width: number, height: number) {
    const sub = new Structure(Rect.atC(this.rect.center(), width, height), this.O)
    this.sub.push(sub)
    return sub
  }

  bisectRooms(attempts = 2) {
    const [rooms, walls] = BSPRooms(this.rect.scale(-1), { attempts })
    this.innerRooms = rooms.map(r => new Structure(r, this.O))
    this.innerWalls = walls

    this.innerRooms.forEach((r, i) => {
      r.label = 'room ' + i
      r.rect.id = i
    })
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
    const unconnected = new Set(this.innerRooms)
    const connected = new Set<Structure>()
    while (unconnected.size > 0) {
      const current = pick([...unconnected])
      // const current = unconnected.pop()
      if (!current) throw new Error('unhandled no more unconnceted?')

      // highlight unconnected
      // const othersMarker = this.O.mutate()
      // unconnected.forEach(r => othersMarker.mark(r.rect))

      // highlight self
      // this.O.mutate().mark(current.rect)

      // scan along each edge, looking for adj rooms
      const self = current.rect
      const adjRoomPts = new Map<Structure, PointSet>()

      for (const yi of range(self.y, self.y2)) {
        // left
        const left = Pt(self.x, yi)
        const cRoomL = this.innerRooms.filter(r => r.rect.intersectsPt(left.add(-2, 0)))
        cRoomL.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new PointSet())
          adjRoomPts.get(cr)?.add(left.add(-1, 0))
        })

        // right
        const right = Pt(self.x2, yi)
        const cRoomR = this.innerRooms.filter(r => r.rect.intersectsPt(right.add(2, 0)))
        cRoomR.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new PointSet())
          adjRoomPts.get(cr)?.add(right.add(1, 0))
        })
      }

      for (const xi of range(self.x, self.x2)) {
        // top
        const top = Pt(xi, self.y)
        const cRoomT = this.innerRooms.filter(r => r.rect.intersectsPt(top.add(0, -2)))
        cRoomT.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new PointSet())
          adjRoomPts.get(cr)?.add(top.add(0, -1))
        })

        // bottom
        const bottom = Pt(xi, self.y2)
        const cRoomB = this.innerRooms.filter(r => r.rect.intersectsPt(bottom.add(0, 2)))
        cRoomB.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new PointSet())
          adjRoomPts.get(cr)?.add(bottom.add(0, 1))
        })
      }

      // connect rooms
      // todo: connect a random amount of rooms (at least one)
      unconnected.delete(current)
      connected.add(current)
      const existing = [...this.innerRoomConnections.values()]
      for (const [room, PtS] of adjRoomPts) {
        // check if a connection has already been made
        if (!existing.some(rooms => rooms.includes(current) && rooms.includes(room))) {
          // create a connection if not
          this.innerRoomConnections.set(pick(PtS.toPt()), [current, room])
        }
      }
    }

    // connect
    // todo different connection themes, eg crumbled wall gap
    const doorsMut = this.O.mutate()
    for (const [pt] of this.innerRoomConnections) {
      doorsMut.set(pt, Terrain.void)
      doorsMut.set(pt, Features.door)
    }
  }

  connectExternal(n = 1) {
    const mut = this.O.mutate()
    let connections = 0
    while (connections < n) {
      const pt = this.rect.rndEdgePt()
      // if no inner walls, or the point isn't adjacent to an inner wall
      if (
        this.innerWalls.length === 0 ||
        !pt.orthNeighbours().some(nPt => this.innerWalls.some(w => w.intersectsPt(pt)))
      ) {
        mut.set(pt, Terrain.void)
        mut.set(pt, Features.door)
        connections++
      }
    }
  }

  floor(t = Terrain.path) {
    if (this.innerRooms.length > 0) this.innerRooms.forEach(r => r.floor(t))
    else this.O.mutate().set(this.rect, t)
  }

  degradedFloor(template: EntityTemplate | EntityTemplate[], chance = 16) {
    if (this.innerRooms.length > 0) this.innerRooms.forEach(r => r.degradedFloor(template))
    else {
      const isSmallRoom = this.rect.width <= 3 || this.rect.height <= 3
      const mut = this.O.mutate()
      this.rect.traverse((pt, edge) => {
        const t = Array.isArray(template) ? pick(template) : template
        if (edge && !isSmallRoom) rnd(1) && mut.set(pt, t)
        else if (isSmallRoom) rnd(4) && mut.set(pt, t)
        else rnd(chance) && mut.set(pt, t)
      })
    }
  }

  feature(template: EntityTemplate, n = 1, terrain?: EntityTemplate) {
    let features = 0
    const mut = this.O.mutate()
    while (features < n) {
      const rect = this.innerRooms.length > 1 ? pick(this.innerRooms).rect : this.rect
      const pt = rect.rndPt()
      if (terrain) mut.set(pt, terrain)
      mut.set(pt, template)
      features++
    }
  }

  createAnnex(width: number, height: number, within: Rect) {
    const self = this.rect
    const dirs = ROT.RNG.shuffle([
      Pt(self.x - half(width), self.cy + rnd(0, 3)),
      Pt(self.x2 + half(width), self.cy + rnd(0, 3)),
      Pt(self.cx + rnd(0, 3), self.y - half(height)),
      Pt(self.cx + rnd(0, 3), self.y2 + half(height)),
    ])
    while (dirs.length > 0) {
      const pt = dirs.pop()
      if (!pt) continue
      console.log('try a:', pt)
      const rect = Rect.atC(pt, width, height)
      // this.O.mutate().mark(rect)
      if (within.contains(rect)) {
        const annex = new Structure(rect, this.O)
        this.sub.push(annex)
      }
    }
  }

  connectAnnexes() {
    if (this.sub.length === 0) return
    const mut = this.O.mutate()
    for (const annex of this.sub) {
      const pts = ROT.RNG.shuffle(this.rect.intersects(annex.rect))
      while (pts.length > 0) {
        const pt = pts.pop()
        if (!pt) continue
        //todo prevent doors into walls
        mut.set(pt, Terrain.void)
        mut.set(pt, Features.door)
        break
      }
    }
  }

  mark(edgeOnly = false) {
    const m = this.O.mutate()
    this.rect.traverse((pt, edge) => {
      if (!edgeOnly) m.set(pt, Features.debugMarker)
      else if (edge) m.set(pt, Features.debugMarker)
    })
  }
}

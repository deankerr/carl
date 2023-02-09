import * as ROT from 'rot-js'
import { EntityKey } from '../../Core/Entity'
import { TerrainKey } from '../../Templates'
import { half, makeOdd, pick, range, rnd, shuffle } from '../../lib/util'
import { Point, point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { BSPRooms } from '../modules/BSPRooms'
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
  bisect() {
    const self = this.rect //tvhis.rect.scale(-1)

    const canSplitV = self.height >= 5
    const canSpiitH = self.width >= 5
    if (!(canSplitV || canSpiitH)) return [this]
    // choose either a width or height to split at
    // true = vert, false = horiz
    const dir = true

    // get split point
    // const split = dir ? rnd(self.x + 2, self.x2 - 2) : rnd(self.y + 2, self.y2 - 2)

    const splitPt1 = dir ? point(self.cx - 1, self.y2) : point(self.x2, self.cy - 1)
    const splitPt2 = dir ? point(self.cx + 1, self.y) : point(self.x, self.cy + 1)
    const sub1 = new Structure(Rect.atxy2(point(self.x, self.y), splitPt1), this.O)
    const sub2 = new Structure(Rect.atxy2(splitPt2, point(self.x2, self.y2)), this.O)

    // border region
    const splitC = dir
      ? Rect.at(point(self.cx, self.y), 1, self.height)
      : Rect.at(point(self.x, self.cy), self.width, 1)
    const sub3 = new Structure(splitC, this.O)
    this.sub.push(sub1, sub2, sub3)
    return [sub1, sub2, sub3]
  }

  inner(width: number, height: number) {
    const self = this.rect

    const x = rnd(self.x, self.x2 - width)
    const y = rnd(self.y, self.y2 - height)
    const sub = new Structure(Rect.at(point(x, y), width, height), this.O)
    this.sub.push(sub)

    return sub
  }

  center(width: number, height: number) {
    const sub = new Structure(Rect.atC(this.rect.center(), width, height), this.O)
    this.sub.push(sub)
    return sub
  }

  bisectRooms(attempts = 2) {
    const [rooms, walls] = BSPRooms(this.rect.scale(-1), { O: this.O, attempts })
    this.innerRooms = rooms.map(r => new Structure(r, this.O))
    this.innerWalls = walls

    this.innerRooms.forEach((r, i) => {
      r.label = 'room ' + i
      r.rect.id = i
    })
  }

  bisectDungeon(attempts: number) {
    const [rooms, walls] = BSPRooms(this.rect.scale(-1), {
      O: this.O,
      attempts,
      minResultSize: 9,
      minToSplitSize: 15,
      favorLargest: true,
    })
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
      if (edge) mutator.setT(pt, 'wall')
    })
  }

  buildInnerWalls() {
    const mut = this.O.mutate()
    this.innerWalls.forEach(w => w.traverse(pt => mut.setT(pt, 'wall')))
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
      const adjRoomPts = new Map<Structure, Set<Point>>()

      for (const yi of range(self.y, self.y2)) {
        // left
        const left = point(self.x, yi)
        const cRoomL = this.innerRooms.filter(r => r.rect.intersectsPt(left.add(-2, 0)))
        cRoomL.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new Set<Point>())
          adjRoomPts.get(cr)?.add(left.add(-1, 0))
        })

        // right
        const right = point(self.x2, yi)
        const cRoomR = this.innerRooms.filter(r => r.rect.intersectsPt(right.add(2, 0)))
        cRoomR.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new Set<Point>())
          adjRoomPts.get(cr)?.add(right.add(1, 0))
        })
      }

      for (const xi of range(self.x, self.x2)) {
        // top
        const top = point(xi, self.y)
        const cRoomT = this.innerRooms.filter(r => r.rect.intersectsPt(top.add(0, -2)))
        cRoomT.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new Set<Point>())
          adjRoomPts.get(cr)?.add(top.add(0, -1))
        })

        // bottom
        const bottom = point(xi, self.y2)
        const cRoomB = this.innerRooms.filter(r => r.rect.intersectsPt(bottom.add(0, 2)))
        cRoomB.forEach(cr => {
          if (!adjRoomPts.has(cr)) adjRoomPts.set(cr, new Set<Point>())
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
          this.innerRoomConnections.set(pick([...PtS]), [current, room])
        }
      }
    }

    // connect
    // todo different connection themes, eg crumbled wall gap
    const doorsMut = this.O.mutate()
    for (const [pt] of this.innerRoomConnections) {
      doorsMut.setT(pt, 'ground')
      doorsMut.setE(pt, 'door')
    }
  }

  floor(t: TerrainKey = 'path') {
    if (this.innerRooms.length > 0) this.innerRooms.forEach(r => r.floor(t))
    if (this.sub.length > 0) this.sub.forEach(r => r.floor(t))
    else this.O.mutate().setT(this.rect, t)
  }

  degradedFloor(template: TerrainKey | TerrainKey[], chance = 16, chance2?: number) {
    if (this.innerRooms.length > 0) this.innerRooms.forEach(r => r.degradedFloor(template))
    else {
      const isSmallRoom = this.rect.width <= 3 || this.rect.height <= 3
      const mut = this.O.mutate()
      this.rect.traverse((pt, edge) => {
        const t = Array.isArray(template) ? pick(template) : template
        if (edge && !isSmallRoom) rnd(1) && mut.setT(pt, t)
        else if (isSmallRoom) rnd(4) && mut.setT(pt, t)
        else if (chance2) rnd(100) < chance2 ? mut.setT(pt, t) : ''
        else if (rnd(chance)) mut.setT(pt, t)
      })
    }
  }

  feature(template: EntityKey, n = 1, terrain?: TerrainKey) {
    let features = 0
    const mut = this.O.mutate()
    const ptsPlaced: Point[] = []
    while (features < n) {
      const rect = this.innerRooms.length > 1 ? pick(this.innerRooms).rect : this.rect
      const pt = rect.rndPt()
      if (terrain) mut.setT(pt, terrain)
      mut.setE(pt, template)
      ptsPlaced.push(pt)
      features++
    }
    return ptsPlaced
  }

  createAnnex() {
    const self = this.rect
    // prepare relatively sized widths/heights for each orientation
    const nsWidth = makeOdd(self.width - 2)
    const nsHeight = makeOdd(half(self.height))
    const ewWidth = makeOdd(half(self.width))
    const ewHeight = makeOdd(self.height - 2)
    const dirs = ROT.RNG.shuffle([
      Rect.atC(point(self.cx, self.y - half(nsHeight)), nsWidth, nsHeight), // north
      Rect.atC(point(self.cx, self.y2 + half(nsHeight)), nsWidth, nsHeight), // south
      Rect.atC(point(self.x - half(ewWidth), self.cy), ewWidth, ewHeight), // east
      Rect.atC(point(self.x2 + half(ewWidth), self.cy), ewWidth, ewHeight), // west
    ])

    while (dirs.length > 0) {
      const rect = dirs.pop()
      if (!rect) continue

      if (!this.sub.some(sub => sub.rect.intersects(rect).length > 0)) {
        const annex = new Structure(rect, this.O)
        this.sub.push(annex)
        return annex
      }
    }
    return undefined
  }

  connectAnnexes() {
    if (this.sub.length === 0) return
    const mut = this.O.mutate()
    for (const annex of this.sub) {
      const pts = ROT.RNG.shuffle(this.rect.intersects(annex.rect))
      while (pts.length > 0) {
        const pt = pts.pop()
        if (!pt) continue

        // aground building a door next to an internal wall
        const walkable = pt.neighbours4().filter(nPt => !mut.query(nPt).blocksMovement)
        if (walkable.length < 2) continue

        mut.setT(pt, 'ground')
        mut.setE(pt, 'door')
        break
      }
    }
  }

  connectExternal(n = 1) {
    const mut = this.O.mutate()
    let connections = 0

    // list of all edge points excluding corners
    const cor = this.rect.cornerPts()
    const edgePts = [...this.rect.edgePoints()].filter(pt => cor.includes(pt))
    const validEdgePts = shuffle(edgePts)

    while (connections < n) {
      const pt = validEdgePts.pop()
      if (!pt) return

      // aground building a door next to an internal wall
      const walkable = pt.neighbours4().filter(nPt => !mut.query(nPt).blocksMovement)
      if (walkable.length < 2) continue

      // aground building a door to an annex
      const isAnnex = walkable.some(pt => this.sub.some(annex => annex.rect.intersectsPt(pt)))
      if (isAnnex) continue

      // if no inner walls, or the point isn't adjacent to an inner wall

      mut.setT(pt, 'ground')
      mut.setE(pt, 'door')
      connections++
    }
  }

  mark() {
    // const m = this.O.mutate()
    // this.rect.traverse((pt, edge) => {
    //   if (!edgeOnly) m.setE(pt, Features.debugMarker)
    //   else if (edge) m.set(pt, Features.debugMarker)
    // })
  }
}

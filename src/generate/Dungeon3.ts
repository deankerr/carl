import * as ROT from 'rot-js'
import { Pt, Point, Rect2, Rect2C, Rect2Grow, Rect2Intersect, Rect2IntersectPt, Rect2RndPt } from './Shapes3'
import { Visualizer } from './Visualizer'

export class Dungeon3 {
  // config
  roomsMin = 6
  roomsTarget = 9
  maxRoomAttempts = 200
  maxCorridorAttempts = 20

  showRoomLabels = true

  // rooms
  // ? "aspect ratio"?
  minRoomW = 5
  maxRoomW = 11
  minRoomH = 3
  maxRoomH = 7
  roomBoundary = 3 // size of rectangular exlcusion space for placement of other rooms (corridors?)
  oddNumberedOnly = true
  edgeBoundary = 2 // prevent selecting points around the level edge

  // fields
  levelWidth: number
  levelHeight: number

  visualizer: Visualizer | null = null

  rooms: Room[] = []
  corridors: Point[][] = []
  connected: Room[] = []
  unconnected: Room[] = []
  nodes: Room[][] = []

  // Create a 2D array of level to check corridor valid
  cMap: string[][]
  msgPrefix = '!!No Prefix!!'
  loglog = false

  // cMap backup
  tempcMap: string[][] | null = null

  constructor(levelWidth = 80, levelHeight = 20, visualizer: Visualizer | null) {
    console.log('%c Dungeon3 ', 'background-color: pink')

    this.levelWidth = levelWidth
    this.levelHeight = levelHeight

    this.createEmptyLevel()

    this.cMap = [...new Array(this.levelHeight)].map(() => new Array(this.levelWidth).fill(' '))

    if (visualizer) this.visualizer = visualizer
    else console.log('no Visualizer attached')
  }

  create() {
    const time = Date.now()

    this.generateRooms()
    this.generateCorridors()
    this.makeFinal()

    console.log('=== Dungeon 2v2 Complete === ', this.rooms)
    console.log(`Time: ${Date.now() - time}ms`)
    this.clog('FINAL')
    this.log('FINAL')
  }

  private digRectIn(cmap: string[][], rect: Rect2, rectChar: string, inner = 0, innerChar = '', innerSkip = '') {
    let innerRect
    if (inner) innerRect = Rect2Grow(rect, inner * -1)

    console.groupCollapsed('digrect')
    console.log(rect, innerRect)
    for (let yi = rect.ly; yi <= rect.ry; yi++) {
      for (let xi = rect.lx; xi <= rect.rx; xi++) {
        if (!this.ptInLevel(Pt(xi, yi))) continue
        // Not in inner
        if (!innerRect || !Rect2IntersectPt(innerRect, Pt(xi, yi))) {
          cmap[yi][xi] = rectChar
          console.log(xi, yi, rectChar)
          continue
        }

        if (!innerChar) continue

        if (!innerSkip?.split('').includes(cmap[yi][xi])) {
          cmap[yi][xi] = innerChar[0]
          console.log(xi, yi, innerChar[0])
        }
      }
    }
    console.groupEnd()
  }

  private digRect(rect: Rect2, rectChar: string, inner = 0, innerChar = '', innerSkip = '') {
    this.digRectIn(this.cMap, rect, rectChar, inner, innerChar, innerSkip)
  }

  private clog(msg = '', cmap?: string[][]) {
    const write = cmap ?? this.cMap
    console.groupCollapsed('CLOG ' + msg)
    write.forEach((e, i) => {
      console.log((i % 2 ? ' ' : '>') + e.join('') + (i % 2 ? '<' : ' '))
    })
    console.groupEnd()
  }

  private log(msg = 'blank', speed = 0) {
    if (!this.visualizer) return
    const hist = this.copy()
    hist.push([this.msgPrefix + msg, speed])
    this.visualizer.history.push(hist)

    if (this.loglog) this.clog(msg)
    this.utemp()
  }

  private copy() {
    return JSON.parse(JSON.stringify(this.cMap))
  }

  private temp() {
    this.tempcMap = this.copy()
  }

  private utemp() {
    if (this.tempcMap) {
      this.cMap = this.tempcMap
      this.tempcMap = null
      // console.log('map restored')
    }
  }
  // TODO Relax map edge check?
  // === Generation ===
  private generateRooms() {
    console.log('generateRooms()')
    let attempts = 0
    this.msgPrefix = `Generate Rooms ${this.rooms.length}/${this.roomsTarget}: `
    // Dig map border
    const border = 1
    const bRect = Rect2(border, border, this.levelWidth - border, this.levelHeight - border)
    this.digRect(bRect, 'b', 1)
    this.log('border')

    while (this.rooms.length < this.roomsTarget) {
      attempts++
      if (attempts >= this.maxRoomAttempts) {
        console.log('Max room attemps reached')
        break
      }

      const room = this.createRandomRoom()

      // check level bounds
      const oob = this.roomInBounds(room)
      if (!oob) {
        this.temp()
        this.digRect(room.rect, 'R')
        this.log('Failed - Level edge')

        continue
      }

      // check intersect
      const blocked = this.rooms.filter((r) => Rect2Intersect(Rect2Grow(r.rect, this.roomBoundary), room.rect))
      if (blocked.length > 0) {
        // blocked
        this.temp()
        this.digRect(room.rect, 'R')
        this.log('Failed - Overlaps room')

        continue
      }

      // success
      this.digRect(room.rect, 'r')
      this.log('Room ' + this.rooms.length)
      this.rooms.push(room)
    }

    // Dig the room walls
    this.rooms.forEach((r) => {
      if (!r.rect.outer) throw new Error('No outer on room rect')
      for (let y = r.rect.outer.ly; y <= r.rect.outer.ry; y++) {
        for (let x = r.rect.outer.lx; x <= r.rect.outer.rx; x++) {
          Rect2IntersectPt(r.rect, Pt(x, y)) ? (this.cMap[y][x] = 'r') : (this.cMap[y][x] = 'w')
        }
      }
    })

    this.log(`Complete ${this.rooms.length}/${this.roomsTarget}`)
    this.clog('Room gen complete')
  }

  // === Rooms ===

  private createRoom(rect: Rect2): Room {
    rect.outer = Rect2Grow(rect)
    return { id: this.rooms.length, rect }
  }

  private createRandomRoom() {
    let w
    let h
    do {
      w = this.rndW()
      h = this.rndH()
    } while (h > w || w > h * 2.5)

    const room = this.createRoom(Rect2C(this.rndP(), w, h))
    return room
  }

  private roomInBounds(room: Room) {
    return this.ptInBounds(Pt(room.rect.lx, room.rect.ly)) && this.ptInBounds(Pt(room.rect.rx, room.rect.ry))
  }

  // TODO rename
  private ptInBounds(p: Point) {
    return (
      p.x > this.edgeBoundary &&
      p.x < this.levelWidth - this.edgeBoundary &&
      p.y > this.edgeBoundary &&
      p.y < this.levelHeight - this.edgeBoundary
    )
  }

  private ptInLevel(p: Point) {
    return p.x > 0 && p.x < this.cMap[0].length && p.y > 0 && p.y < this.cMap.length
  }

  // === Corridors ===
  private generateCorridors() {
    this.msgPrefix = 'Generate Corridors: '
    this.loglog = true
    const maxAttempts = 1
    let attempts = 0

    this.unconnected = this.rooms.map((r) => r)

    while (this.unconnected.length > 5) {
      if (attempts >= maxAttempts) {
        console.error(`generateCorridors max attempts exceeded ${attempts}/${maxAttempts}`)
        break
      }
      attempts++

      console.log(`%c generateCorridors ${attempts} `, 'background-color: orange')
      console.groupCollapsed('Rooms:', this.unconnected.length)
      console.log(this.unconnected)
      console.groupEnd()

      this.connectRooms()
      // this.paintAll('outer')
    }
    console.log('final', this.unconnected)
    this.log('gen Cor done?')
  }

  // Connects rooms to closest unconnected rooms.
  private connectRooms() {
    let atmpt = 0
    const max = 20

    let next: Room | undefined

    while (this.unconnected.length > 0) {
      const origin = next ?? this.unconnected[0]
      // console.log('Connecting:', origin.id)

      let targets = this.floodFindClosest(origin, this.unconnected)
      let target = ROT.RNG.getItem(targets)

      if (!target) {
        // If it's the last room, connect to the closest room
        targets = this.floodFindClosest(origin, this.rooms)
        target = ROT.RNG.getItem(targets)
      }

      if (!target) throw new Error(`Could not find corridor target for ${origin.id}`)

      console.groupCollapsed(`%cConnect Rooms ${origin.id} to ${target.id} (${atmpt++})`, 'color: blue')
      console.log('Unconnected: ', this.unconnected)

      const newConnectedRooms = new Set<Room>()
      let lastPointWasInWall = false
      const corridorDigMap = this.copy()

      // ===== PATH CORRIDOR =====
      let valid = true
      console.groupCollapsed('pathing')
      this.pathCorridor(origin, target, (x, y) => {
        if (!valid) return
        if (this.cMap[y][x] == 'w' && lastPointWasInWall) {
          // Fail!
          this.temp()
          this.cMap = corridorDigMap
          this.log(`Failed ${origin.id} to ${target?.id}`)
          valid = false
          return
        }

        // OK
        lastPointWasInWall = this.cMap[y][x] == 'w'
        const room = this.roomAt(Pt(x, y))
        if (room) newConnectedRooms.add(room)

        // TODO move/use dig
        // Dig the corridor into the charMap

        console.log('start dig', x, y)
        // this.digRectIn(corridorDigMap, Rect2C(Pt(x, y), 3, 3), 'w', 1, 'c', 'r')

        for (let yi = y - 1; yi <= y + 1; yi++) {
          for (let xi = x - 1; xi <= x + 1; xi++) {
            const cur = corridorDigMap[yi][xi]
            console.log(x, y, xi, yi, cur)
            if (cur === 'r' || cur === 'c') continue // don't overwrite rooms or corridors
            console.log('dig')
            corridorDigMap[yi][xi] = 'w'
            if (yi == y && xi == x) corridorDigMap[yi][xi] = 'c'
          }
        }
      })
      console.groupEnd()
      // ===== END PATH CORRIDOR =====

      console.log('valid:', valid)

      if (valid) {
        this.cMap = corridorDigMap

        // Remove all connect rooms
        this.unconnected = this.unconnected.filter((r) => ![...newConnectedRooms].includes(r))

        next = target
      }

      console.groupEnd()
      this.log(`New corridor ${origin.id} to ${target.id}`)
      if (atmpt >= max) {
        console.error('connectRooms() max')
        break
      }
    }
    // Outer
  }

  private pathCorridor(from: Room, to: Room, callback: cCallBack) {
    // A* path random points in each room
    const fromPt = Rect2RndPt(from.rect)
    const toPt = Rect2RndPt(to.rect)
    const path = new ROT.Path.AStar(toPt.x, toPt.y, () => true, { topology: 4 })
    path.compute(fromPt.x, fromPt.y, callback)
  }

  private floodFindClosest(origin: Room, others: Room[]) {
    let flood = { ...origin.rect }
    // Remove origin and excluded rooms
    const targets = others.filter((r) => r !== origin)

    const found: Room[] = []
    while (found.length < this.rooms.length - 1 && flood.w < this.levelWidth * 2) {
      flood = Rect2Grow(flood)
      const hit = targets.filter((r) => Rect2Intersect(flood, r.rect) && !found.includes(r))

      if (hit.length > 0) {
        found.push(...hit)
      }
    }
    return found
  }

  private roomAt(p: Point): Room | null {
    const result = this.rooms.filter((r) => Rect2IntersectPt(r.rect, p))
    if (result.length > 1) throw new Error(`Multiple rooms at pt, this shouldn't happen`)
    return result.length > 0 ? result[0] : null
  }

  private makeFinal() {
    this.cMap = this.cMap.map((row) =>
      row.map((e) => {
        if (e === 'r' || e === 'c') return '.'
        if (e === 'w') return '#'
        return ' '
      })
    )
  }

  private createEmptyLevel() {
    // ? from ts style
    // [0, 0, 0, 0, 0]
    //Array.from<number>({ length: 5 }).fill(0);
    // ts deep dive
    // https://basarat.gitbook.io/typescript/main-1/create-arrays
  }

  // private roomIndex(room: Room) {
  //   return this.rooms.findIndex((r) => r === room)
  // }

  private rndP(): Point {
    return Pt(rnd(1, this.levelWidth - 1), rnd(1, this.levelHeight))
  }

  private rndW() {
    return oRnd(this.minRoomW, this.maxRoomW)
  }

  private rndH() {
    return oRnd(this.minRoomH, this.maxRoomH)
  }

  // ? get with length?
  // private get(p: Point) {
  //   return this.level[p.y].charAt(p.x)
  // }

  // ? "level" param could be a level with visual only changes to illustrate something
  // private visual(msg = '(no message)') {
  //   // ? should this just have a totally seperate copy for visual info only?
  //   // ? i dont feel i need actual level data just yet but i might

  //   if (this.visualizer) {
  //     // console.log('visualizer:', this.visualizer)
  //     this.visualizer.snapshot([...this.level], [...this.color], msg)
  //   }
  // }
}
interface Room {
  id: number
  rect: Rect2 // "Floor/path" space, not including wall
}

function rnd(from: number, to: number) {
  return ROT.RNG.getUniformInt(from, to)
}

function oRnd(from: number, to: number) {
  let num

  do {
    num = ROT.RNG.getUniformInt(from, to)
  } while (num % 2 == 0)

  return num
}

type cCallBack = (x: number, y: number) => void

// "command"/"action" pattern?
//   this.visual() // (snap)
//   this.visual('msg', 1000) // message, time
//   this.visual('pause', 'look at this', 1000) // visual command, message, time
// }

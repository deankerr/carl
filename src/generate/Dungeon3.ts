import * as ROT from 'rot-js'
import { Pt, Point, Rect2, Rect2C, Rect2Grow, Rect2Intersect, Rect2IntersectPt, Rect2RndPt } from './Shapes3'
import { Visualizer } from './Visualizer'

export class Dungeon3 {
  // config
  roomsMin = 6
  roomsTarget = 9
  maxRoomAttempts = 200
  maxCorridorAttempts = 20

  emptyChar = ' '
  boundChar = '·'
  boundColor = '#444'
  showBoundaries = true
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
  color: string[] = []
  highlight: Room[] = []

  level: string[] = []
  saved: string[] = []
  savedColor: string[] = []

  rooms: Room[] = []
  corridors: Point[][] = []
  connected: Room[] = []
  unconnected: Room[] = []
  nodes: Room[][] = []

  // Create a 2D array of level to check corridor valid
  charMap: string[][]

  // Every charMap for visualizer playback
  history: string[][][] = []

  constructor(levelWidth = 80, levelHeight = 20, visualizer: Visualizer | null) {
    console.log('%c Dungeon3 ', 'background-color: pink')

    this.levelWidth = levelWidth
    this.levelHeight = levelHeight

    this.createEmptyLevel()

    this.charMap = [...new Array(this.levelHeight)].map(() => new Array(this.levelWidth).fill(' '))

    if (visualizer) this.visualizer = visualizer
    else console.log('no Visualizer attached')
  }

  create() {
    const time = Date.now()

    // eslint-disable-next-line prefer-const
    let seed = ROT.RNG.getUniformInt(1000, 9999)
    // seed = 21449

    ROT.RNG.setSeed(seed)
    console.log('create() seed:', seed)

    this.generateRooms()
    this.generateCorridors()

    this.paintFinal()
    console.log('=== Dungeon 2v2 Complete === ', this.rooms)
    console.log(`Time: ${Date.now() - time}ms`)
  }

  // === Generation ===
  private generateRooms() {
    console.log('generateRooms()')
    let attempts = 0

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
        this.paintAll('(Rooms) Out of bounds', room, 'r')
        continue
      }

      // check intersect
      const blocked = this.rooms.filter((r) => Rect2Intersect(Rect2Grow(r.rect, this.roomBoundary), room.rect))
      if (blocked.length > 0) {
        // blocked

        this.paintAll('(Rooms) Blocked', room, 'r')
        continue
      }

      // success
      this.paintAll(`(Rooms) Room ${this.rooms.length}`, room, 'c')
      this.rooms.push(room)
    }

    this.showBoundaries = false
    let label = `0(Rooms) Room gen complete ${this.rooms.length}/${this.roomsTarget}`
    if (this.rooms.length < this.roomsTarget) {
      label += this.rooms.length >= this.roomsMin ? ' (acceptable)' : ' (UNACCEPTABLE)'
    }
    this.paintAll(label)

    // Dig the room walls
    this.rooms.forEach((r) => {
      if (!r.rect.outer) throw new Error('No outer on room rect')
      for (let y = r.rect.outer.ly; y <= r.rect.outer.ry; y++) {
        for (let x = r.rect.outer.lx; x <= r.rect.outer.rx; x++) {
          Rect2IntersectPt(r.rect, Pt(x, y)) ? (this.charMap[y][x] = 'r') : (this.charMap[y][x] = 'w')
        }
      }
    })
    logLevelArr(this.charMap)
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

    const room = this.createRoom(Rect2C(this.rndP(this.edgeBoundary), w, h))
    // console.log('createRandomRoom:', room.rect.w, room.rect.h)
    return room
  }

  private roomInBounds(room: Room) {
    return this.ptInBounds(Pt(room.rect.lx, room.rect.ly)) && this.ptInBounds(Pt(room.rect.rx, room.rect.ry))
  }

  private ptInBounds(p: Point) {
    return (
      p.x > this.edgeBoundary &&
      p.x < this.levelWidth - this.edgeBoundary &&
      p.y > this.edgeBoundary &&
      p.y < this.levelHeight - this.edgeBoundary
    )
  }

  private generateCorridors() {
    const maxAttempts = 1
    let attempts = 0

    this.unconnected = this.rooms.map((r) => r)

    while (this.unconnected.length > 1) {
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
      logLevelArr(this.charMap, 'final')
    }
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

      const corridor: Point[] = []
      const newConnectedRooms = new Set<Room>()
      let lastPointWasInWall = false
      const tempCharMap = JSON.parse(JSON.stringify(this.charMap))

      let valid = true

      console.groupCollapsed('pathing')
      this.pathCorridor(origin, target, (x, y) => {
        corridor.push(Pt(x, y)) // TODO adding for visual only, remove this
        if (!valid) return

        // logLevelArr(tempCharMap, 'path')
        if (this.charMap[y][x] == 'w' && lastPointWasInWall) {
          // Fail!
          console.log('wall fail!!!')
          valid = false
          return
        }

        // OK
        lastPointWasInWall = this.charMap[y][x] == 'w'
        // corridor.push(Pt(x, y)) // !
        const room = this.roomAt(Pt(x, y))
        if (room) newConnectedRooms.add(room)

        // Dig the corridor into the charMap
        for (let yi = y - 1; yi <= y + 1; yi++) {
          for (let xi = x - 1; xi <= x + 1; xi++) {
            const cur = tempCharMap[yi][xi]
            if (cur === 'r' || cur === 'c') continue // don't overwrite rooms or corridors
            tempCharMap[yi][xi] = 'w'
            if (yi == y && xi == x) tempCharMap[yi][xi] = 'c'
          }
        }
      })
      console.groupEnd()
      console.log('valid:', valid)

      if (!valid) {
        this.corridors.push(corridor) // TODO Visual only
        this.paintAll('Invalid corridor!')
        this.corridors.pop()
        logLevelArr(tempCharMap)
      } else {
        this.corridors.push(corridor)
        this.charMap = tempCharMap

        // Remove all connect rooms
        this.unconnected = this.unconnected.filter((r) => ![...newConnectedRooms].includes(r))

        next = target

        logLevelArr(this.charMap)
        this.paintAll(`New corridor ${origin.id} to ${target.id}`)
      }
      console.groupEnd()

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
      // this.paintAll('Flood', flood)
    }
    return found
  }

  private roomAt(p: Point): Room | null {
    const result = this.rooms.filter((r) => Rect2IntersectPt(r.rect, p))
    if (result.length > 1) throw new Error(`Multiple rooms at pt, this shouldn't happen`)
    return result.length > 0 ? result[0] : null
  }

  // ========== Paint ==========
  private paintFinal() {
    // cor walls
    this.corridors.forEach((corrs) =>
      corrs.forEach((c) => {
        this.paintRect(Rect2C(c, 3, 3), '#')
      })
    )

    // room walls
    this.rooms.forEach((room) => {
      this.paintRect(Rect2Grow(room.rect, 1), '#')
    })

    // cor paths
    this.corridors.forEach((corrs) =>
      corrs.forEach((c) => {
        this.paint(c, '.')
      })
    )

    // room paths
    this.rooms.forEach((room) => {
      this.paintRect(room.rect, '.')
    })

    this.visual('Complete?')
  }

  private paintAll(label = '(no label)', item?: Room | Rect2 | Point[], color?: string) {
    this.createEmptyLevel()

    // Flood
    if (item && !('rect' in item) && !('length' in item)) {
      this.paintRect(item, 'f', color)
    }

    // Corridor
    if (this.corridors.length > 0) {
      this.corridors.forEach((corrs) => corrs.forEach((c) => this.paint(c, 'c')))
    }

    // Rooms
    this.rooms.forEach((r, i) => {
      if (this.showBoundaries) this.paintRect(Rect2Grow(r.rect, 3), this.boundChar, this.boundColor) // boundary
      // this.paintRect(Rect2Grow(r.rect, 1), '#') // wall
      let rColor
      // if (this.connected.includes(r)) rColor = 'u' // lowlight connected rooms
      this.paintRect(r.rect, 'R', rColor) // floor
      this.paint(Pt(r.rect.cx, r.rect.cy), `${i}`, 'o')
    })

    // edge boundary
    // top/bottom
    if (this.showBoundaries) {
      for (let i = 0; i < this.edgeBoundary; i++) {
        this.paint(Pt(0, i), this.boundChar.repeat(this.levelWidth), this.boundColor.repeat(this.levelWidth))
        this.paint(
          Pt(0, this.levelHeight - 1 - i),
          this.boundChar.repeat(this.levelWidth),
          this.boundColor.repeat(this.levelWidth)
        )
      }
      // left/right
      for (let i = 0; i < this.levelHeight; i++) {
        this.paint(Pt(0, 0 + i), this.boundChar.repeat(this.edgeBoundary), this.boundColor.repeat(this.edgeBoundary))
        this.paint(
          Pt(this.levelWidth - this.edgeBoundary, 0 + i),
          this.boundChar.repeat(this.edgeBoundary),
          this.boundColor.repeat(this.edgeBoundary)
        )
      }
    }

    if (item) {
      // New Room
      if ('rect' in item) {
        this.paintRect(item.rect, 'R', color)
      }

      // New corridor
      if ('length' in item) {
        const newC = item.slice(1, -1)

        newC.forEach((c) => this.paint(c, 'c', color))
      }
    }

    // new Corridor
    if (this.corridors.length > 0) {
      this.corridors.at(-1)?.forEach((c) => this.paint(c, 'c', 'c'))
    }

    this.visual(label)
  }

  private paintRect(rect: Rect2, value: string, color: string = this.emptyChar, exclude?: Rect2) {
    for (let yi = rect.ly; yi <= rect.ry; yi++) {
      // console.log('paintRect', rect, value, color)
      this.paint(Pt(rect.lx, yi), value.repeat(rect.w), color[0].repeat(rect.w), exclude)
    }
  }

  // ? seperate color function?
  private paint(p: Point, value: string, color: string = this.emptyChar, exclude?: Rect2) {
    if (p.y < 0 || p.y >= this.level.length) return

    if (exclude) {
      // mini rect to exclude the char line
      const horzRect = Rect2(p.x, p.y, p.x + value.length - 1, p.y)
      console.log('horzRect:', horzRect)
      if (Rect2IntersectPt(horzRect, p)) {
        console.log('exlude!')
        return
      }
    }

    function slicer(data: string[], p: Point, val: string) {
      let x = p.x
      if (x < 0) {
        val = val.slice(x * -1)
        x = 0
      }

      const row = data[p.y]
      const prev = row.slice(0, x)
      const next = row.slice(x + val.length, row.length)
      const newRow = (prev + val + next).slice(0, row.length)

      return newRow
    }

    const newRow = slicer(this.level, p, value)
    const newColor = slicer(this.color, p, color)

    if (newRow.length > this.levelWidth)
      throw new Error(
        `paint: level row string too big - newRow: ${newRow.length}, levelWidth: ${this.levelWidth}, p: ${p.x},${p.y}, value: ${value}, value.length: ${value.length}`
      )

    this.level[p.y] = newRow
    this.color[p.y] = newColor
  }

  private createEmptyLevel() {
    const row = this.emptyChar.repeat(this.levelWidth)
    const level = new Array(this.levelHeight).fill(row)

    this.level = level
    this.color = [...level]

    // ? from ts style
    // [0, 0, 0, 0, 0]
    //Array.from<number>({ length: 5 }).fill(0);

    // ts deep dive
    // https://basarat.gitbook.io/typescript/main-1/create-arrays
  }

  // private roomIndex(room: Room) {
  //   return this.rooms.findIndex((r) => r === room)
  // }

  private rndP(edge = 1): Point {
    return Pt(rnd(edge, this.levelWidth - 1 - edge), rnd(edge, this.levelHeight - 1 - edge))
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
  private visual(msg = '(no message)') {
    // ? should this just have a totally seperate copy for visual info only?
    // ? i dont feel i need actual level data just yet but i might

    if (this.visualizer) {
      // console.log('visualizer:', this.visualizer)
      this.visualizer.snapshot([...this.level], [...this.color], msg)
    }
  }
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

function logLevelArr(level: string[][], msg = 'map') {
  console.groupCollapsed(msg)
  level.forEach((e, i) => {
    console.log((i % 2 ? '.' : ',') + e.join(''))
  })
  console.groupEnd()
}
type cCallBack = (x: number, y: number) => void

// "command"/"action" pattern?
//   this.visual() // (snap)
//   this.visual('msg', 1000) // message, time
//   this.visual('pause', 'look at this', 1000) // visual command, message, time
// }

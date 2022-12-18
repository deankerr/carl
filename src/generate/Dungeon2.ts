import * as ROT from 'rot-js'
import { enlargeRect, Pt, Point, Rect, rectsIntersect } from './Shapes'
import { Visualizer } from './Visualizer'

// TODO Combine all paints/visual into one function?

export class Dungeon2 {
  // config
  emptyChar = ' '
  targetRoomsMin = 7
  targetRoomsMax = 8
  maxRoomPlaceAttempts = 200

  // rooms
  // ? "aspect ratio"?
  minRoomW = 5
  maxRoomW = 11
  minRoomH = 3
  maxRoomH = 7
  roomBoundary = 4 // size of rectangular exlcusion space for placement of other rooms (corridors?)
  oddNumberedOnly = true
  edgeBoundary = 3 // prevent selecting points around the level edge

  // fields
  levelWidth: number
  levelHeight: number

  visualizer: Visualizer | null = null
  color: string[] = []

  level: string[] = []
  saved: string[] = []
  savedColor: string[] = []

  rooms: Room[] = []

  constructor(levelWidth = 80, levelHeight = 20, visualizer: Visualizer | null) {
    console.log('new Dungeon2')

    this.levelWidth = levelWidth
    this.levelHeight = levelHeight

    // Test vals
    // this.levelWidth = 10
    // this.levelHeight = 10

    this.createEmptyLevel()

    if (visualizer) this.visualizer = visualizer
    else console.log('no Visualizer attached')
  }

  // visualizer control idea
  // fakevisualizer() {
  // direct control?
  // not portable
  //   this.visualizer.snap()
  //   this.visualizer.pause()
  //   this.visualizer.revert(1)

  // "command"/"action" pattern?
  //   this.visual() // (snap)
  //   this.visual('msg', 1000) // message, time
  //   this.visual('pause', 'look at this', 1000) // visual command, message, time
  // }

  create() {
    console.log('Dungeon2.create()')
    // ROT.RNG.setSeed(1234)

    this.visual(`Let's make a dungeon`)

    this.generateRooms()
    // this.generateRoomsFar()

    // === End ===
    // console.log('this.level:', this.level)
    // console.log('this.color:', this.color)
    console.log('this.rooms:', this.rooms)
    this.visual('Complete')
  }

  // === Generation ===

  private generateRooms() {
    let roomAttempts = 0
    while (this.rooms.length < this.targetRoomsMax) {
      if (roomAttempts >= this.maxRoomPlaceAttempts) {
        console.error(`Room placement attempts exceeded: ${roomAttempts}`)
        console.log('this.rooms:', this.rooms)
        return
      }

      this.save()
      const room = this.createRandomRoom()

      const blocking = this.rooms.filter((r) => {
        return rectsIntersect(r.boundary, room.rect)
      })

      if (blocking.length) {
        this.paintRoomsWithBounds(room, 'r')
        this.visual('Invalid room position')
        this.restore()
        roomAttempts++
        continue
      }

      this.rooms.push(room)
      this.paintRoomsWithBounds()
      this.visual('Placing room ' + this.rooms.length.toString())
    }

    this.createEmptyLevel()
    this.paintRooms()
    this.visual(`Rooms placed (attempts: ${roomAttempts})`)
  }

  private generateRooms2() {
    let roomAttempts = 0
    while (this.rooms.length < this.targetRoomsMax) {
      if (roomAttempts >= this.maxRoomPlaceAttempts) {
        console.error(`Room placement attempts exceeded: ${roomAttempts}`)
        console.log('this.rooms:', this.rooms)
        return
      }

      this.save()
      const room = this.createRandomRoom()

      const blocking = this.rooms.filter((r) => {
        return rectsIntersect(r.boundary, room.rect)
      })

      if (blocking.length) {
        this.paintRoomsWithBounds(room, 'r')
        this.visual('Invalid room position')
        this.restore()
        roomAttempts++
        continue
      }

      this.rooms.push(room)
      this.paintRoomsWithBounds()
      this.visual('Placing room ' + this.rooms.length.toString())
    }

    this.createEmptyLevel()
    this.paintRooms()
    this.visual(`Rooms placed (attempts: ${roomAttempts})`)
  }

  private paintAll() {
    // config
    const edgeChar = 'x'

    this.createEmptyLevel()

    // edge boundary
    // top/bottom
    for (let i = 0; i < this.edgeBoundary; i++) {
      this.paint(Pt(0, i), edgeChar.repeat(this.levelWidth), 'b'.repeat(this.levelWidth))
      this.paint(Pt(0, this.levelHeight - 1 - i), edgeChar.repeat(this.levelWidth), 'b'.repeat(this.levelWidth))
    }
    // left/right
    for (let i = 0; i < this.levelHeight; i++) {
      this.paint(Pt(0, 0 + i), edgeChar.repeat(this.edgeBoundary), 'b'.repeat(this.edgeBoundary))
      this.paint(
        Pt(this.levelWidth - this.edgeBoundary, 0 + i),
        edgeChar.repeat(this.edgeBoundary),
        'b'.repeat(this.edgeBoundary)
      )
    }

    this.paintRoomsWithBounds()

    // // ! test
    // for (let i = 0; i < 50; i++) {
    //   this.paint(this.randomPoint(), 'p', 'o')
    // }

    // Done
    this.visual()
  }

  // === Rooms ===

  private createRoom(rect: Rect) {
    // console.log('createRoom', rect)

    // this.visual(this.setRect(rect, 'R', 'r'))
    const boundary = enlargeRect(rect, this.roomBoundary)
    const room: Room = { rect, boundary }

    return room
  }

  private createRandomRoom() {
    // ? enforce odd sized rooms?
    let from
    let to
    do {
      from = this.rndP()
      if (this.oddNumberedOnly)
        to = Pt(from.x + oddRnd(this.minRoomW, this.maxRoomW) - 1, from.y + oddRnd(this.minRoomH, this.maxRoomH) - 1)
      to = Pt(from.x + rnd(this.minRoomW, this.maxRoomW) - 1, from.y + rnd(this.minRoomH, this.maxRoomH) - 1)
    } while (!this.isInBounds(Pt(to.x + 2, to.y + 2)))

    const r = Rect(from, to)
    // console.log('randroomrect:', r)
    return this.createRoom(r)
  }

  private createRoomAt(p: Point) {
    return this.createRoom(Rect(p, Pt(oddRnd(this.minRoomW, this.maxRoomW), oddRnd(this.minRoomH, this.maxRoomH))))
  }

  private paintRoomsWithBounds(room?: Room, color?: string) {
    if (color == undefined) color = ' '

    if (this.rooms.length > 0) {
      // existing boundaries first
      this.rooms.forEach((r) => this.paintRect(r.boundary, 'x'))
      // walls
      // this.rooms.forEach((r) => this.paintRect(enlargeRect(r.rect), '#'))
      // floor
      this.rooms.forEach((r) => this.paintRect(r.rect, 'R'))
    }

    // paint invalid
    if (room) {
      // this.paintRect(enlargeRect(room.rect), '#', color)
      this.paintRect(room.rect, 'X', color)
    }
  }

  private paintRooms() {
    if (this.rooms.length > 0) {
      // walls
      this.rooms.forEach((r) => this.paintRect(enlargeRect(r.rect), '#'))
      // floor
      this.rooms.forEach((r) => this.paintRect(r.rect, '.'))
    }
  }

  // === Data structure access ===

  private rndP(): Point {
    // ? min: 1,1
    return Pt(rnd(2, this.levelWidth - 1), rnd(2, this.levelHeight - 1))
  }

  private randomPoint() {
    const ed = this.edgeBoundary
    return Pt(rnd(ed, this.levelWidth - ed - 1), rnd(ed, this.levelHeight - ed - 1))
  }

  private isInBounds(zone: Point | Rect): boolean {
    if ('from' in zone && 'to' in zone) {
      return this.isInBounds(Pt(zone.from.x, zone.from.y)) && this.isInBounds(Pt(zone.to.x, zone.to.y))
    }

    return zone.x >= 0 && zone.x < this.levelWidth && zone.y >= 0 && zone.y < this.levelHeight
  }

  // ? get with length?
  private get(p: Point) {
    return this.level[p.y].charAt(p.x)
  }

  private paintRect(rect: Rect, value: string, color: string = this.emptyChar) {
    for (let yi = rect.from.y; yi <= rect.to.y; yi++) {
      this.paint(Pt(rect.from.x, yi), value.repeat(rect.width), color[0].repeat(rect.width))
    }
  }

  // ? seperate color function?
  private paint(p: Point, value: string, color: string = this.emptyChar) {
    if (p.y < 0 || p.y >= this.level.length) return

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

  private save() {
    this.saved = [...this.level]
    this.savedColor = [...this.color]
  }
  private restore() {
    this.level = [...this.saved]
    this.color = [...this.savedColor]
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

  // ? "level" param could be a level with visual only changes to illustrate something
  private visual(msg = '(no message)', speed = 1) {
    // ? should this just have a totally seperate copy for visual info only?
    // ? i dont feel i need actual level data just yet but i might

    if (this.visualizer) {
      // console.log('visualizer:', this.visualizer)
      this.visualizer.snapshot([...this.level], [...this.color], msg)
    }
  }
}

// TODO this will need more info
interface Room {
  rect: Rect // ? inner only? ie not walls
  boundary: Rect // other room(/feature) exclusion zone
}

function rnd(from: number, to: number) {
  return ROT.RNG.getUniformInt(from, to)
}

function oddRnd(from: number, to: number) {
  let num

  do {
    num = ROT.RNG.getUniformInt(from, to)
  } while (num % 2 == 0)

  return num
}

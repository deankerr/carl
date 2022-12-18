import * as ROT from 'rot-js'
import {
  Pt,
  Point,
  PtNeighbours,
  Rect2,
  Rect2C,
  Rect2Grow,
  Rect2Intersect,
  Rect2IntersectPt,
  Rect2RndPt,
} from './Shapes3'
import { Visualizer } from './Visualizer'

// TODO Move "paint/visual" into Visualizer

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

  constructor(levelWidth = 80, levelHeight = 20, visualizer: Visualizer | null) {
    console.log('%cDungeon3', 'background-color: purple')

    this.levelWidth = levelWidth
    this.levelHeight = levelHeight

    // Test vals
    // this.levelWidth = 10
    // this.levelHeight = 10

    this.createEmptyLevel()

    this.charMap = [...new Array(this.levelHeight)].map(() => new Array(this.levelWidth).fill(' '))

    if (visualizer) this.visualizer = visualizer
    else console.log('no Visualizer attached')
  }

  SEED = 21449

  create() {
    console.log('create()')
    ROT.RNG.setSeed(this.SEED)

    this.generateRooms()
    // this.generateCorridors2()
    this.generateCorridors()

    // this.paintFinal()
    console.log('=== Dungeon 2v2 Complete === ', this.rooms)
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
        // this.paintAll('(Rooms) Out of bounds', room, 'r')
        continue
      }

      // check intersect
      const blocked = this.rooms.filter((r) => Rect2Intersect(Rect2Grow(r.rect, this.roomBoundary), room.rect))
      if (blocked.length > 0) {
        // blocked

        // this.paintAll('(Rooms) Blocked', room, 'r')
        continue
      }

      // success
      // this.paintAll(`(Rooms) Room ${this.rooms.length}`, room, 'c')
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
    return { id: this.rooms.length, rect, connectedTo: [] }
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
    //
    // Corridor object?
    // Return Rooms, Corridors, connected info?
    // Nodes?
    // Flexible, allow different strategies, eg. connect closest or random?
    // Detect bad placements, ie corridors that scrap along rooms or other corridors
    // Avoid confusing nested loops
    // Traverse rooms to find groups, or (probably) store and update that info live
    // Outer loop: handles nodes, Inner loop: connects supplied nodes
    //
    //  Visualizer? Prefer to keep data encapsualted/functional
    //
    // connectClosest(from[], to[]) - Iterates through nodes, connecting node to closest unconnected.
    // connectRandom()?
    //

    // Initialize
    const maxAttempts = 1
    let attempts = 0

    // Add each room as a node
    this.nodes = this.rooms.map((r) => [r])

    while (this.nodes.length > 1) {
      if (attempts >= maxAttempts) {
        console.error(`generateCorridors max attempts exceeded ${attempts}/${maxAttempts}`)
        break
      }
      attempts++

      console.log(`%c generateCorridors ${attempts} `, 'background-color: orange')
      console.groupCollapsed('nodes:', this.nodes.length)
      console.log(this.nodes)
      console.groupEnd()

      let connect: Room[] = []
      if (this.nodes.length === this.rooms.length) {
        // First run, supply all nodes
        connect = this.nodes.flat()
      } else {
        console.error('not implemented')
      }

      this.connectRooms(connect)
      // this.paintAll('outer')
    }
  }

  // Connects rooms to closest unconnected rooms.
  private connectRooms(rooms: Room[]) {
    let unconnected = [...rooms]

    let atmp = 0
    const max = 20

    const nodes = []

    while (unconnected.length > 1) {
      console.groupCollapsed(`%cConnect Rooms ${atmp++}`, 'color: blue')
      const origin = unconnected[0]
      // Find closest unconnected room/s
      const targets = this.floodFindClosest(origin, unconnected)
      const target = ROT.RNG.getItem(targets)

      if (!target) throw new Error('Could not get corridor target')

      const corridor: Point[] = []
      const connectedRooms = new Set<Room>()
      let lastPointWasInWall = false
      const tempCharMap = JSON.parse(JSON.stringify(this.charMap))

      let valid = true

      console.groupCollapsed('pathing')
      this.pathCorridor(origin, target, (x, y) => {
        corridor.push(Pt(x, y)) // TODO adding for visual only, remove this
        if (!valid) return

        logLevelArr(tempCharMap, 'path')
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
        if (room) connectedRooms.add(room)
        this.charMap[y][x] != 'r' ? (tempCharMap[y][x] = 'c') : ''
      })
      console.groupEnd()
      console.log('valid:', valid)

      if (!valid) {
        this.corridors.push(corridor) // TODO Visual only
        this.paintAll('Invalid corridor!')
        this.corridors.pop()
      } else {
        this.corridors.push(corridor)
        this.charMap = tempCharMap

        // Remove connected rooms from list
        // ? remove extra rooms connected?
        unconnected = unconnected.filter((r) => r !== origin && r !== target)

        // Nodes time
        console.log(
          'connectedRooms before noding',
          [...connectedRooms].map((e) => e.id)
        )
        const newNode = new Set<Room>([...connectedRooms])

        // Loop through existing nodes
        // find any new connected rooms
        // add them all to new node
        // delete existing node
        // add new node
        const matching = this.nodes.filter((node) => node.includes)
        // nodes.push(connectedRooms)

        logLevelArr(this.charMap)
        this.paintAll(`New corridor ${origin.id} to ${target.id}`)
      }
      console.groupEnd()

      if (atmp >= max) {
        console.error('connectRooms() max')
        break
      }
    }
    // Outer
    console.log('nodes:', nodes)
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

  // ========== Corridors ==========
  private generateCorridors2() {
    console.log('generateCorridors2()')
    if (this.rooms.length == 0) throw new Error('Make some rooms first bro')

    let outerAttempts = 0
    const outerMax = 5

    let groups: number[][] = [] // ? maintain and update, or regen each time?

    // Connect nodes into 1 group (ie dungeon connected)
    // ? i hate nested whiles
    while (groups.length != 1 && outerAttempts < outerMax) {
      // outer loop
      outerAttempts++
      console.info(`%c=== Corridor Loop Outer ${outerAttempts} ===`, 'background-color: orange')
      console.log('Current groups:', groups)

      // Create connected/unconnected (1 random member of a group to connect)
      if (groups.length == 0) {
        console.log('Groups empty, should be the start of corridor gen')
        this.unconnected = [...this.rooms]
      } else {
        // ? Could we do it live instead of this merge step?
        // Merge groups
        console.groupCollapsed('Group merge')
        const newGroups: number[][] = []
        this.rooms.forEach((r) => {
          console.groupCollapsed('Finding groups containing room', r.id)
          const match = groups.filter((group) => group.includes(r.id))
          console.log('Found match:', match)
          // Create a new merged group
          const newGroup = [...new Set<number>(match.flat())].sort()
          console.log('newGroup:', newGroup)
          // Check if newGroups already has this array
          console.log('Check for array equality')

          const alreadyExists = newGroups.some(
            (g) => g.length === newGroup.length && g.every((e, i) => e === newGroup[i])
          )
          if (alreadyExists) {
            console.log('already exists')
          } else {
            console.log('does not exist, adding')
            newGroups.push(newGroup)
          }
          console.log('newGroups is now:', newGroups.toString())
          console.groupEnd()
        })
        groups = [...newGroups]
        console.groupEnd()
        console.log('Merged groups:', newGroups)

        if (groups.length === 1) {
          console.log('%cAll rooms connected!! (?)', 'background-color: lightgreen')
          break
        }

        // Select rooms to be connected
        // first room in each group
        this.unconnected = groups.map((g) => this.rooms[g[0]])
        this.connected = []
      }

      let innerAttempts = 0
      const innerMax = 10
      // ? condition - we cant get out? (there is a break)
      // TODO Function? Give this room groups to connect
      while (innerAttempts < innerMax) {
        // inner loop
        innerAttempts++
        console.groupCollapsed(`%c=== Corridor Loop Inner ${innerAttempts} ===`, 'background-color: cyan')
        console.log('Unconnected', this.unconnected)

        if (this.unconnected.length == 0) {
          console.log('break!')
          console.groupEnd()
          break
        }

        // Select origin room
        const origin = ROT.RNG.getItem(this.unconnected)
        if (!origin) throw new Error('origin was somehow null')

        // Get a list of rooms in order of distance
        console.log('Find close rooms for:', origin.id)
        const allRooms = this.floodFindAllClosest(origin)

        // Select a destination
        let target: Room
        if (this.unconnected.length === 1) {
          // If it's the last room, connect it randomly
          target = ROT.RNG.getItem(allRooms) as Room
        } else {
          // Closest unconnected
          target = allRooms.filter((r) => this.unconnected.includes(r))[0]
        }

        if (!target) throw new Error('Could not get corridor target')

        // Generate the corridor
        const corridor = this.createCorridor(origin, target)
        if (!corridor) throw new Error('i didnt get corridor :(')
        console.log('Connected:', origin.id, target.id)

        // Add corridor, mark rooms as connected
        this.corridors.push(corridor)
        this.connected.push(origin, target)
        this.unconnected = this.unconnected.filter((r) => r !== origin && r !== target)

        // ? Should we do this after, so we get some extra corridors for more randomness
        // ? seperate function, recursion?
        // Traverse corridor, find all rooms it touches (could be more than the origin/target)
        const connectedRoomSet = new Set<number>()
        corridor.forEach((p) => {
          const room = this.roomAt(p)
          if (room) connectedRoomSet.add(room.id)
        })

        // Traverse connected rooms, adding any other connections they have
        // ? will this also traverse new rooms as we add them (i think so?)
        // ? do we need to loop multiple times to ensure we get all?
        connectedRoomSet.forEach((roomID) => {
          this.rooms[roomID].connectedTo.forEach((connectedRoom) => connectedRoomSet.add(connectedRoom))
        })

        console.log('Adding connectedRooms', [...connectedRoomSet])
        // Add all connected rooms to each room
        connectedRoomSet.forEach((roomID) => {
          // Don't add yourself // ? or do? who cares?
          const roomsToAdd = [...connectedRoomSet].filter((connectedRoom) => roomID !== connectedRoom)
          const currentConnected = this.rooms[roomID].connectedTo
          const roomConnectionsSet = new Set<number>([...currentConnected, ...roomsToAdd])
          this.rooms[roomID].connectedTo = [...roomConnectionsSet]
        })
        console.groupEnd()

        groups.push([...connectedRoomSet])

        this.paintAll(`Connect ${origin.id} to ${target.id}`)
      } // inner loop end
      this.paintAll(`Connect ${outerAttempts} complete`)
      if (innerAttempts >= innerMax) console.error(`Inner attempts exceeded: ${innerAttempts}/${innerMax}`)
    } // outer loop end
    if (outerAttempts >= outerMax) console.error(`Outer attempts exceeded: ${outerAttempts}/${outerMax}`)
    console.log('generateCorridors() end', outerAttempts)
  } // generateCorridors()

  private floodFindAllClosest(origin: Room) {
    let flood = { ...origin.rect }
    const others = this.rooms.filter((r) => r !== origin)
    const found: Room[] = []
    while (found.length < this.rooms.length - 1 && flood.w < this.levelWidth * 2) {
      flood = Rect2Grow(flood)
      const hit = others.filter((r) => Rect2Intersect(flood, r.rect) && !found.includes(r))

      if (hit.length > 0) {
        found.push(...hit)
      }
      // this.paintAll('Flood', flood)
    }
    return found
  }

  private createCorridor(from: Room, to: Room) {
    // TODO Detect door placement
    // A* path random points in each room
    const fromPt = Rect2RndPt(from.rect)
    const toPt = Rect2RndPt(to.rect)
    const path = new ROT.Path.AStar(toPt.x, toPt.y, () => true, { topology: 4 })
    const corridor: Point[] = []
    path.compute(fromPt.x, fromPt.y, (x, y) => corridor.push(Pt(x, y)))
    return corridor
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

  private roomIndex(room: Room) {
    return this.rooms.findIndex((r) => r === room)
  }

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
  connectedTo: number[] // ? i dunno man
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

// ? original valid corridor appraoch
// console.groupCollapsed('Check valid corridor')
// const valid = corridor.every((point) => {
//   console.log('Checking pt', point, lastPointWasInBoundary)
//   // If point is in a room, add it and return
//   const room = this.roomAt(point)
//   if (room) {
//     connectedRooms.add(room)
//     console.log('in room! (ok)', room)
//     lastPointWasInBoundary = false
//     return true
//   }

//   // If point is in a room boundary
//   if (Rect2IntersectPt(roomBoundaries, point)) {
//     console.log('in boundary!')
//     if (lastPointWasInBoundary) {
//       console.log('Two boundaries, invalid')
//       return false
//     }
//     lastPointWasInBoundary = true
//     // ! probably shouldnt exit here
//     return true
//   }

//   console.log('seems fine')
//   lastPointWasInBoundary = false
//   return true
//   // Get neighbouring points
//   // const nPts = PtNeighbours(point)
//   // console.log(`nPts: ${point.x}, ${point.y}`, nPts)
// })
// console.groupEnd()
// console.log('valid:', valid)

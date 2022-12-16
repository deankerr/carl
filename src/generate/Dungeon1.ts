// ? generate set of big/med/small rooms, place in that order to promote better coverage?
// ? group corridor connects path around rooms?
// ? create corridor objects from A* path => push all path tiles, then remove tiles in rooms > return arrays of remaining connected path tiles
// ? if big spaces empty/map occupied < $amount, place extra rooms after main gen complete, connect to closest (or w/e) rooms (=> secret rooms?)
// ? room gen: place first room, then find furtherest point from room, place, repeat? could lead to better spaced rooms + faster than random choices?

// import * as ROT from 'rot-js'
import { RNG, Path } from 'rot-js'

// prefer connect to room with connection instead?
export class Dungeon1 {
  // emptyChar = '•'
  emptyChar = ' '
  mapW: number
  mapH: number
  maps: string[][][] = []
  map: string[][] = []
  rooms: Room[] = []
  roomWidths: number[] = []
  roomHeights: number[] = [] // TODO do this smarter
  outerMap: string[][][] = []
  finalMap: string[][] = []
  labelRooms = true

  // config
  edgeMargin = 2 // spacing between map edge and features

  minRoomW = 5
  maxRoomW = 11

  minRoomH = 3
  maxRoomH = 5

  targetRooms = 8

  roomMargin = 3

  constructor(width: number, height: number, outerMap: string[][][]) {
    // RNG.setSeed(1671040088977)
    // RNG.setSeed(1234)
    console.log(`==== New Dungeon1 ==== Seed: ${RNG.getSeed()}`)

    this.outerMap = outerMap

    this.mapW = width
    this.mapH = height

    console.log(`Max x: ${this.mapW - 1}, Max y: ${this.mapH - 1}`)

    // Generate allowed room w/h lists
    const widths = [this.minRoomW]
    let stepW = this.minRoomW
    while (widths[widths.length - 1] < this.maxRoomW) {
      stepW += 2
      widths.push(stepW)
    }

    console.log('Allowed room widths:', widths)
    this.roomWidths = widths

    const heights = [this.minRoomH]
    let stepH = this.minRoomH
    while (heights[heights.length - 1] < this.maxRoomH) {
      stepH += 2
      heights.push(stepH)
    }

    console.log('Allowed room heights:', heights)
    this.roomHeights = heights
  }

  create() {
    const timeStart = Date.now()
    this.createBlankMap()

    // === Create random rooms ===
    let roomGenCount = 0
    while (this.rooms.length < this.targetRooms) {
      const newRoom = this.createRandomRoom()
      if (this.checkValidRoom(newRoom)) {
        this.paintRoom(newRoom)
        this.rooms.push(newRoom)
        this.paintMap('Create new room')
      } else {
        this.paintRoom(newRoom, 'r')
        this.paintMap('Invalid room position')
        this.revertMap('', true)
      }

      roomGenCount++
      if (roomGenCount > 200) throw new Error('roomGenCount attempts exceeded')
    }

    // === Connect with corridors ===
    console.log('=== Create initial corridors ===')

    // let connectedRooms = this.getConnectedRooms()
    let corridorAttempts = 0
    const maxCorridorAttempts = 100

    while (this.getConnectedRooms().length < this.rooms.length && corridorAttempts < maxCorridorAttempts) {
      // Select unconnected room
      const originRoom = this.rooms.find((r) => r.connectsTo.length === 0)
      if (!originRoom) throw new Error('Unhandled: no unconnected rooms found at start of corridor loop')

      // Select already connected rooms
      const connectedRooms = this.getConnectedRooms()

      // == find closest room by flood ==
      const mapBeforeFlood = this.copy(this.map)
      let found = null
      let attempt = 0

      let flood = [originRoom.lx, originRoom.ly, originRoom.rx, originRoom.ry]

      let floodFindExcluded = []
      // Is this a lonely last room?
      if (this.rooms.length - connectedRooms.length === 1) {
        // Then allow connections to any room but self
        console.log('Lonely room, connected room dests enabled')
        floodFindExcluded = [originRoom]
      } else {
        // Exlcuded connected and self
        floodFindExcluded = [...connectedRooms, originRoom]
        // Mark connected rooms unavailable
        if (connectedRooms.length > 0) {
          connectedRooms.forEach((r) => this.paintRoom(r, 'u', 'r'))
          this.paintMap('Mark connected rooms unavailable')
        }
      }

      do {
        flood = flood.map((e, i) => (i === 0 || i === 1 ? e - 1 : e + 1)) // expand box
        found = this.floodFind(flood, floodFindExcluded)
        this.paintMap(`Find close unconnected room: flood ${attempt}`)
        attempt++
      } while (found === null && attempt <= 100)
      // console.log('floodFind:', found)
      if (found === null) throw new Error('Unhandled Corridor Flood Find: no room found')

      const destRoomPoint = RNG.getItem(found)
      if (!destRoomPoint) throw new Error('Unhandled: destRoomPoint is null')
      const destRoom = destRoomPoint.room

      // console.log('Select random point:', destRoomPoint)

      this.map = this.copy(mapBeforeFlood)
      this.map[destRoomPoint.y][destRoomPoint.x] = 'Cg'
      this.paintMap('Corridor origin selected')

      // Mark each room passable
      this.paintRoom(originRoom, 'c', 'D')
      this.paintRoom(destRoom, 'c', 'O')
      this.paintMap('Mark rooms passable')

      const newConnections = this.paintCorridor(destRoomPoint.x, destRoomPoint.y, originRoom.cx, originRoom.cy)
      this.paintMap('Create corridor')

      // Mark each room as room again
      this.paintRoom(originRoom)
      this.paintRoom(destRoom)
      this.paintMap('Restore rooms')

      // Mark rooms connected
      // originRoom.connectsTo.push(this.rooms.findIndex((r) => r === destRoom))
      // destRoom.connectsTo.push(this.rooms.findIndex((r) => r === originRoom))
      // messy :(
      const newConnectionIndexes = newConnections.map((r) => this.rooms.findIndex((r2) => r === r2))
      // console.log('newConnectionIndexes:', newConnectionIndexes)
      newConnections.forEach((r) => {
        newConnectionIndexes.forEach((i) => {
          if (!r.connectsTo.includes(i)) r.connectsTo.push(i)
        })
      })

      corridorAttempts++
      // console.log('= Corridor loop complete =')

      // DEBUG
      // break

      // if (corridorAttempts > 3) break
    }

    if (corridorAttempts >= 100) {
      throw new Error('Corridor attempts exceeded')
    }

    // Should do this properly during corridor gen instead (sort of am but badly)
    console.log('==== Connect room groups ===')
    let roomGroups = this.findConnectedRoomGroups()
    // console.log('roomGroups', roomGroups)

    let mergeGroupAttempts = 0

    // connect groups
    while (roomGroups.length > 1) {
      mergeGroupAttempts++
      if (mergeGroupAttempts > 100) throw new Error('Failed to merge groups')

      // select random group 0 member
      const originRoomI = RNG.getItem(roomGroups[0])
      if (originRoomI === null) throw new Error('connect group orign room is null')
      const originRoom = this.rooms[originRoomI]
      // console.log('originRoom', originRoom)

      const mapBeforeFlood = this.copy(this.map)

      // TODO: DRY!
      let flood = [originRoom.lx, originRoom.ly, originRoom.rx, originRoom.ry]
      let found = null
      let attempt = 0
      do {
        flood = flood.map((e, i) => (i === 0 || i === 1 ? e - 1 : e + 1)) // expand box
        found = this.floodFind(
          flood,
          roomGroups[0].map((i) => this.rooms[i])
        )
        this.paintMap(`Find unconnected room group: flood ${mergeGroupAttempts}`)
        attempt++
      } while (found === null && attempt <= 100)

      // console.log('merge floodFind:', found)
      if (found === null) throw new Error('Unhandled Merge FloodFind: no room found')

      const destRoomPoint = RNG.getItem(found)
      if (!destRoomPoint) throw new Error('Unhandled: destRoomPoint is null')
      const destRoom = destRoomPoint.room

      // console.log('Select random point:', destRoomPoint)

      this.map = this.copy(mapBeforeFlood)
      this.map[destRoomPoint.y][destRoomPoint.x] = 'Cg'
      this.paintMap('Corridor origin selected')

      // Mark each room passable
      this.paintRoom(originRoom, 'c', 'D')
      this.paintRoom(destRoom, 'c', 'O')
      this.paintMap('Mark rooms passable')

      this.paintCorridor(destRoomPoint.x, destRoomPoint.y, originRoom.cx, originRoom.cy)
      this.paintMap('Create corridor')

      // Mark each room as room again
      this.paintRoom(originRoom)
      this.paintRoom(destRoom)
      this.paintMap('Restore rooms')

      roomGroups = this.findConnectedRoomGroups()
      // console.log('roomGroups.length:', roomGroups.length)
    }

    // Covert to game graphics

    // Turn all empty to wall, else: floor
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j] === this.emptyChar) {
          this.map[i][j] = '#'
        } else this.map[i][j] = '.'
      }
    }

    this.paintMap('Convert to walls/paths')

    // === Create doors ===
    console.log('=== Create doors ===')

    const roomOpenings: Point[] = []

    this.rooms.forEach((r) => {
      const rect = createRectangle(r.lx, r.ly, r.rx, r.ry) // TODO util func this
      const result = this.paintOuterRect(rect, ['.'])
      result.map((e) => roomOpenings.push(e))
    })

    // console.log('roomOpenings:', roomOpenings)

    this.paintMap('Find room openings')
    this.revertMap('', true)

    // ? const results: Point[] = getNeighbours(Point, ['#'])

    // Find door candidates, ie. positions with two orth wall neighbours
    // ? Can choose bad places. Could create a more strict definition, but probably do it in the rewrite
    const doorCandidates = roomOpenings.filter((p) => this.getOrthNeighbours(p, ['#']).length === 2)
    // console.log('doorCandidates:', doorCandidates)
    doorCandidates.forEach((p) => (this.map[p.y][p.x] = 'fc'))
    this.paintMap('Door candidates')

    // Make random amount doors
    this.revertMap('', true)
    const doorChance = 0.75
    const doors = []
    doorCandidates.forEach((p) => {
      if (RNG.getUniform() < doorChance) {
        this.map[p.y][p.x] = '+b'
        doors.push(p)
      }
    })

    this.paintMap('Doors are real')

    // Game ready display
    this.labelRooms = false
    this.paintMap('no labels')
    // traverse all tiles, turn blank if only touch other walls
    for (let yi = 0; yi < this.map.length; yi++) {
      for (let xi = 0; xi < this.map[yi].length; xi++) {
        if (this.map[yi][xi] != '#') continue
        const n = this.getNeighbours(Point(xi, yi), ['.', '+b'])
        if (n.length === 0) this.map[yi][xi] = ' '
      }
    }

    this.paintMap('Done')

    // ================ End of Create function ================
    this.finalMap = this.map

    console.log('==== Dungeon1.create() Done ====')
    console.log('==== Rooms:', this.rooms)
    console.log('==== connectedRooms:', this.getConnectedRooms().length)
    console.log(`Time: ${Date.now() - timeStart}ms`)
  }

  getOrthNeighbours(p: Point, matching?: string[]): Point[] {
    const points = [
      Point(p.x, p.y - 1), // north
      Point(p.x + 1, p.y), // east
      Point(p.x, p.y + 1), // south
      Point(p.x - 1, p.y), // west
    ]

    const results: Point[] = []
    // ? do this with map/reduce/filter?
    points.forEach((orth) => {
      if (!this.isInBounds(orth.x, orth.y)) return // out of bounds
      const neighbour = Point(orth.x, orth.y, this.map[orth.y][orth.x])
      if (!matching) results.push(neighbour) // no criteria, just return the point
      else if (matching.includes(neighbour.contents)) results.push(neighbour) // return match
    })

    // console.log('orth neighs', results)
    return results
  }

  getNeighbours(p: Point, matching?: string[]): Point[] {
    // console.log(`getNeighbours around ${p.x},${p.y} ${matching ? matching : '(no match criteria)'}`)

    const pointRect = enlargeRectangle(createRectangle(p.x, p.y, p.x, p.y)) // ? make get outer rect of point function?
    // console.log('pointRect:', pointRect)

    const results: Point[] = []
    for (let yi = pointRect.ly; yi <= pointRect.ry; yi++) {
      for (let xi = pointRect.lx; xi <= pointRect.rx; xi++) {
        if (!this.isInBounds(xi, yi)) continue // out of bounds
        if (yi === p.y && xi === p.x) continue // ignore the point itself
        if (!matching) results.push(Point(xi, yi, this.map[yi][xi])) // no match criteria, return anything
        else if (matching.includes(this.map[yi][xi])) results.push(Point(xi, yi, this.map[yi][xi])) // return match
      }
    }

    // console.log('getNeigh:', results)
    return results
  }

  // ? make generic function to traverse rectangle?
  // ? should use this for floodfill
  // TODO generic filled/hollow version
  paintOuterRect(innerRect: Rectangle, findChar: string | string[]): Point[] {
    const outerRect = enlargeRectangle(innerRect)
    let target: string[] = []
    if (typeof findChar === 'string') target = [findChar]
    else target = findChar.map((e) => e)

    const results = []
    // console.log('OuterRect find target:', target)

    for (let i = outerRect.ly; i <= outerRect.ry; i++) {
      for (let j = outerRect.lx; j <= outerRect.rx; j++) {
        if (!this.isInBounds(j, i)) continue
        if (pointIsWithinRectangle(j, i, innerRect)) continue
        const contents = this.map[i][j]
        if (target.includes(contents)) {
          results.push({ x: j, y: i, contents })
          this.map[i][j] = 'fc'
        } else this.map[i][j] = 'fr'
      }
    }

    // console.log('OuterRect find results', results)
    return results
  }

  getConnectedRooms() {
    return this.rooms.filter((r) => r.connectsTo.length > 1)
  }

  paintCorridor(fromX: number, fromY: number, toX: number, toY: number): Room[] {
    const path = new Path.AStar(
      toX,
      toY,
      () => {
        // return this.map[y][x] !== 'R' && this.map[y][x] !== 'r'
        // ? think about what we want to tunnel through

        return true
      },
      { topology: 4 }
    )

    const newConnections: Room[] = []
    path.compute(fromX, fromY, (x, y) => {
      this.map[y][x] = 'c'
      // Find all rooms connected by this corridor (could be more than two)
      const room = this.pointIsInRoom(x, y, this.rooms)
      if (room && !newConnections.includes(room)) newConnections.push(room)
    })

    // console.log('newConnections:', newConnections)
    return newConnections
  }

  floodFind(flood: number[], excludeRooms: Room[]) {
    // console.log('floodFind()')
    if (excludeRooms.length === 0) throw new Error('floodFind() has no exclusions, will find itself (bad)')
    const [lx, ly, rx, ry] = flood
    // const otherRooms = this.rooms.filter((r) => r !== room)
    const result = []
    for (let i = ly; i <= ry; i++) {
      for (let j = lx; j <= rx; j++) {
        // skip out of bounds
        if (!this.isInBounds(j, i)) continue

        // // skip origin room
        // if (this.pointIsInRoom(j, i, [excludeRooms]) === excludeRooms) continue

        // skip excluded rooms
        if (this.pointIsInRoom(j, i, excludeRooms)) continue

        // check point is in room
        const hit = this.pointIsInRoom(j, i, this.rooms)

        // mark empty space
        if (hit === null) {
          this.map[i][j] = 'fc'
          continue
        }

        // mark already connected room (lonely can still connect)
        // if (hit.connections > 0) this.map[i][j] = 'xu'
        // if (excludeRooms) this.map[i][j] = 'xu'

        // match
        // console.log('hit!', hit)
        this.map[i][j] = 'fr'
        result.push({ room: hit, x: j, y: i })
      }
    }

    // return result || null
    if (result.length > 0) return result
    return null
  }

  findConnectedRoomGroups() {
    // console.log('findConnectedRoomGroups()')
    const roomFound = this.rooms.map(() => false)
    const groups: number[][] = []

    this.rooms.forEach((r, i) => {
      if (!roomFound[i]) {
        const result = this.roomsHavePathTo(r)
        // console.log('res', result)
        result.forEach((r) => (roomFound[r] = true))
        groups.push(result)
      }
    })

    // console.log('groups:', groups)
    return groups
  }

  roomsHavePathTo(dest: Room) {
    const pathFound: number[] = []

    const path = new Path.AStar(dest.cx, dest.cy, (x, y) => {
      return this.isInBounds(x, y) && this.map[y][x] !== this.emptyChar
    })

    // this.rooms.forEach((r) => {
    //   let result = false
    //   path.compute(r.cx, r.cy, () => {
    //     result = true
    //   })
    //   pathFound.push(result)
    // })
    this.rooms.forEach((r, i) => {
      let result = false
      path.compute(r.cx, r.cy, () => {
        result = true
      })
      if (result) pathFound.push(i)
    })

    // console.log('pathFound: ', pathFound)

    return pathFound
  }

  pointIsInRoom(x: number, y: number, rooms: Room[]): Room | null {
    // rooms.forEach((r) => {
    //   if (x >= r.lx && x <= r.rx && y >= r.ly && y <= r.ry) return r
    // })
    const matchedRoom = rooms.find((r) => {
      return x >= r.lx && x <= r.rx && y >= r.ly && y <= r.ry // TODO use generic rect function
    })
    if (matchedRoom) return matchedRoom
    return null
  }
  // findClosestRoom(room: Room) {}

  createRandomRoom(): Room {
    const x = RNG.getUniformInt(
      Math.floor(this.minRoomW / 2) + this.edgeMargin,
      this.mapW - Math.floor(this.maxRoomW / 2) - this.edgeMargin - 1
    )
    const y = RNG.getUniformInt(
      Math.floor(this.minRoomH / 2) + this.edgeMargin,
      this.mapH - Math.floor(this.maxRoomH / 2) - this.edgeMargin - 1
    )

    const w = RNG.getItem(this.roomWidths)
    const h = RNG.getItem(this.roomHeights)

    if (!w || !h) {
      throw new Error(`Could not get room w/h: ${w}, ${h}`)
    }

    const newRoom = this.createRoomCentre(x, y, w, h)
    return newRoom
  }

  createRoomCentre(cx: number, cy: number, w: number, h: number): Room {
    if (w % 2 == 0 || h % 2 == 0) {
      throw new Error(`createRoomCentre: supply an odd numbered width/height ${w} ${h}`)
    }

    const lx = cx - Math.floor(w / 2)
    const ly = cy - Math.floor(h / 2)
    const rx = lx + w - 1
    const ry = ly + h - 1

    const newRoom = {
      w,
      h,
      lx,
      ly,
      cx,
      cy,
      rx,
      ry,
      connectsTo: [],
    }
    // console.log('newRoom: ', newRoom)
    return newRoom
  }

  checkValidRoom(room: Room) {
    let result = true

    // TODO could be way more efficient, use the new Rectangle technology
    // margin/oob check
    const margin = 2 // should force a 1 tile margin at world edge
    for (let yi = room.ly - margin; yi <= room.ry + margin; yi++) {
      for (let xi = room.lx - margin; xi <= room.rx + margin; xi++) {
        if (!this.isInBounds(xi, yi)) return false
      }
    }

    // room check
    for (let i = room.ly - this.roomMargin; i <= room.ry + this.roomMargin; i++) {
      for (let j = room.lx - this.roomMargin; j <= room.rx + this.roomMargin; j++) {
        // console.log(`CheckValidRoom i: ${i}, j: ${j}`)
        if (this.isInBounds(j, i) && this.map[i][j] !== this.emptyChar) {
          result = false
        }
      }
    }
    return result
  }

  isInBounds(x: number, y: number) {
    return x >= 0 && x < this.mapW && y >= 0 && y < this.mapH
  }

  paintRoom(room: Room, colourChar = '', roomChar = 'R') {
    // console.log(`Painting room:`, room)
    for (let i = room.ly; i <= room.ry; i++) {
      for (let j = room.lx; j <= room.rx; j++) {
        this.map[i][j] = roomChar + colourChar
      }
    }
    // console.log('Done')
  }

  // Multiple Map management
  paintMap(msg = '(paint - no label)') {
    const newMap = this.copy(this.map)
    this.maps.push(newMap)

    this.updateOuterMap(msg)
  }

  revertMap(msg = '(revert)', silent = false) {
    const newMap = this.copy(this.maps[this.maps.length - 2])
    this.map = this.copy(this.maps[this.maps.length - 2])
    this.maps.push(newMap)

    if (!silent) this.updateOuterMap(msg)
  }

  updateOuterMap(msg: string) {
    const newOuterMap = this.copy(this.map)

    // label rooms
    if (this.labelRooms && this.rooms) {
      this.rooms.forEach((room, index) => {
        newOuterMap[room.cy][room.cx] = `${index}g`
      })
    }

    newOuterMap.push([msg])
    this.outerMap.push(newOuterMap)
  }

  createBlankMap() {
    const map: string[][] = []

    // Fill map with empty
    for (let i = 0; i < this.mapH; i++) {
      const row = []
      for (let j = 0; j < this.mapW; j++) {
        row.push(this.emptyChar)
      }
      map.push(row)
    }

    // this.maps.push(map)
    this.map = map
    this.paintMap('Blank map')
  }

  copy(map: string[][]) {
    return JSON.parse(JSON.stringify(map))
  }

  // ROT map style create
  get(callback: (x: number, y: number, contents: number) => void) {
    if (!this.finalMap) throw new Error('no map here yet bud')
    console.log('this.finalMap:', this.finalMap)
    for (let yi = 0; yi < this.finalMap.length; yi++) {
      for (let xi = 0; xi < this.finalMap[yi].length; xi++) {
        let char = 0
        const cell = this.finalMap[yi][xi][0]
        switch (cell) {
          case '#':
          case ' ':
            char = 1
            break
          case '+':
            char = 3
            break
          case '.':
            char = 0
            break
        }

        callback(xi, yi, char)
      }
    }
  }
}

interface Point {
  x: number
  y: number
  contents: string
}

function Point(x: number, y: number, contents = ''): Point {
  return { x, y, contents }
}

interface Room {
  w: number
  h: number
  lx: number // left
  ly: number // left
  cx: number // centre
  cy: number // centre
  rx: number // right
  ry: number // right
  connectsTo: number[]
}

interface Rectangle {
  // convert to left -> from/ right -> to?
  lx: number
  ly: number
  rx: number
  ry: number
}

function createRectangle(lx: number, ly: number, rx: number, ry: number): Rectangle {
  return { lx, ly, rx, ry }
}

function pointIsWithinRectangle(x: number, y: number, rect: Rectangle) {
  const result = x >= rect.lx && x <= rect.rx && y >= rect.ly && y <= rect.ry
  // console.log('pointIsWithinRectangle:', x, y, rect, result)
  return result
}

function enlargeRectangle(rect: Rectangle, amount = 1): Rectangle {
  return createRectangle(rect.lx - amount, rect.ly - amount, rect.rx + amount, rect.ry + amount)
}

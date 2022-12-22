// TODO clean up duplicate functions/functionality, add later improvements to earlier stages
// TODO improve room gen (larger, flatter, more distrubted rooms)
// TODO -> BSP? 'grow rooms' at empty points?
// TODO use more globals(rooms/corridors)? (so much is read by and passed around to everything, Object.freeze etc.?)
// TODO (but also ?) break into multiple files ? easier to switch/try out new methods
// TODO reduce excess CharMap copies
// TODO smarter corridors
// TODO !!! save RNG state to replicate history as needed? !!!
// TODO (... basic unit tests?)

import * as ROT from 'rot-js'
import { Rect } from './Rectangle'

export type CharMap = string[][]
type Point = { x: number; y: number }

// --- Config ---
const maxRooms = 8
const maxRoomAttempts = 500
const levelEdge = 1
const roomBorderSize = 3

const minRoomXSize = 3
const maxRoomXSize = 7

const minRoomYSize = 2
const maxRoomYSize = 4

const maxCorridorAttempts = 50

// --- Globals ---
export const history: CharMap[] = []
let current: CharMap = []
let width: number
let height: number

export function Dungeon4(w: number, h: number) {
  console.log('welcome... to dung4')
  const time = Date.now()

  // set up
  width = w
  height = h

  current = [...new Array(height)].map(() => new Array(width).fill(' '))
  current = digRect(current, Rect.at(0, 0, width, height), '·')
  current = digRect(current, Rect.at(1, 1, width - 2, height - 2), ' ')

  // wipe old history (store this?)
  // history = []

  snapshot(current, 'New', 'new')

  const seed = ROT.RNG.getUniformInt(1000, 9999)
  ROT.RNG.setSeed(seed)
  // ROT.RNG.setSeed(8109) created diagonal corner room opening
  // ROT.RNG.setSeed(7805)
  console.log('create()', width, height, ROT.RNG.getSeed())
  console.log(ROT.RNG.getState())

  // TODO priorities bigger rooms, smarter placement?
  const trooms = Date.now()
  const rooms = generateRooms()
  console.log(`Complete - Rooms: ${rooms.length} Time: ${Date.now() - trooms}ms`)

  const tcorr = Date.now()
  const corridors = generateCorridors(rooms)
  console.log(`Complete - Corridors: ${corridors.length}, Time: ${Date.now() - tcorr}ms`)

  // Assemble the complete level
  let final = createBlankMap()
  final = digRoom(final, rooms, '.', '#', false)
  final = digCorridor(final, corridors, '.', '#')
  final = createDoors(final, rooms)
  final = centerLevel(final, rooms)

  snapshot(final, 'Generation complete')
  consoleLogMap(final, true, 'Final')

  const t = Date.now() - time
  snapshot(final, 'Done ' + t + 'ms', 'done')
  console.log('Took ' + t + 'ms')
}

// #region ===== 1. Rooms =====

function generateRooms(): Room[] {
  let attempts = 0
  const rooms: Room[] = []
  console.groupCollapsed('%c  generateRooms()  ', 'background-color: cyan')
  while (rooms.length < maxRooms) {
    if (++attempts >= maxRoomAttempts) {
      console.error('Max attempts exceeded', attempts, maxRoomAttempts)
      break
    }

    console.log(`%cGenerate room attempt: ${attempts}`, 'background-color: orange')

    // lazily encourage larger, more horizontal rooms until later
    let xs: number
    if (attempts / maxRoomAttempts < 0.75) {
      const xs1 = rnd(minRoomXSize, maxRoomXSize)
      const xs2 = rnd(minRoomXSize, maxRoomXSize)
      xs = xs1 > xs2 ? xs1 : xs2
    } else {
      xs = rnd(minRoomXSize, maxRoomXSize)
    }

    const room = Room.scaled(
      rnd(0, width - 1),
      rnd(0, height - 1),
      xs,
      rnd(minRoomYSize, maxRoomYSize),
      rooms.length.toString()
    )

    if (!roomInBounds(room)) {
      console.log('fail: oob')
      const failed = digRect(current, room.rect, 'x')
      snapshot(failed, 'OOB', 'roomfail')
      continue
    }

    if (!roomSpaceValid(room, rooms)) {
      console.log('fail: invalid')
      const failed = digRect(current, room.rect, 'x')
      snapshot(failed, 'Invalid', 'roomfail')
      continue
    }

    console.log('Success!')
    rooms.push(room)
    current = digRoom(current, room, 'R', '·')
    snapshot(current, 'Success', 'roomsuccess')
  }
  console.groupEnd()

  // reduce room borders to wall
  rooms.forEach((r) => (r.border = r.rect.scale(1)))
  return rooms
}

// Room must be in level bounds, and not touching an edge
function roomInBounds(room: Room) {
  return rectInBounds(current, room.rect, levelEdge)
}

// Room can't overlap other room's borders
function roomSpaceValid(newRoom: Room, currentRooms: Room[]) {
  const result = currentRooms.every((r) => {
    return r.border.intersects(newRoom.rect) === null
  })

  return result
}

class Room {
  readonly rect: Rect
  readonly label: string
  border: Rect

  constructor(rect: Rect, label: string, borderSize: number) {
    this.rect = rect
    this.label = label
    this.border = rect.scale(borderSize)
  }

  static scaled(x: number, y: number, xScale: number, yScale: number, label = '?') {
    const rect = Rect.scaled(x, y, xScale, yScale)

    return new Room(rect, label, roomBorderSize)
  }
}

// #endregion

// #region ===== 2. Corridors ======
// TODO Better console log output
function generateCorridors(rooms: Room[]) {
  console.group('%c  generateCorridors()  ', 'background-color: cyan')
  const corridors: Corridor[] = []

  let level = createBlankMap()
  level = digRoom(level, rooms, '.', 'w', true, 'c')
  snapshot(level, 'Generate Corridors', 'corrstart')

  let unconnected = [...rooms]
  // remove [0], connect it first
  let next = unconnected.shift()
  if (next === undefined) throw new Error('There are no rooms at start?')
  let targets: Room[] = [...unconnected]

  let attempts = 0
  while (unconnected.length > 0) {
    if (++attempts > maxCorridorAttempts) {
      console.error('generateCorridors attempts exceeded', attempts, maxCorridorAttempts)
      break
    }
    console.groupCollapsed(`%c Corridor ${attempts} - Unconnected: ${unconnected.length} `, 'background-color: orange')
    console.log('Next:', next, 'Targets:', targets)
    const origin = next
    const ftime = Date.now()
    const target = floodFind(origin, targets, level)
    console.log(`Time: ${Date.now() - ftime}ms`)
    // ? maintain target list, only floodfill if empty?

    if (!target) {
      // TODO ???
      console.error('No target.')
      break
    }

    const result = connectRooms(level, origin, target)

    if (result) {
      console.log('corridor created')
      const corridor = new Corridor(result, corridors.length)
      corridors.push(corridor)
      // update rooms
      const roomsPathed = new Set<Room>()
      corridor.points.forEach((pt) => {
        const room = rooms.find((r) => r.rect.intersectsPt(pt))
        if (room) roomsPathed.add(room)
      })

      unconnected = unconnected.filter((r) => ![...roomsPathed].includes(r))
      console.log('unconnected is now:', unconnected)

      level = digCorridor(level, corridor, '.')
      snapshot(level, 'Corridor created', 'corrsuccess')
      // set up next round
      next = unconnected[0]
      targets = rooms.filter((r) => !unconnected.includes(r))
    } else {
      // TODO better stages of desperation as the misses pile up
      // try to set a different origin (/target?)
      console.groupEnd()
      console.warn('I am struggling.')
      console.log('origin:', origin, 'target', target)
      console.log('targets:', targets)
      console.log('unconnected:', unconnected)
      const newNext = ROT.RNG.getItem(unconnected.filter((r) => r !== origin))
      if (!newNext) {
        // this is this last origin? try removing the last target
        targets = targets.filter((r) => r !== target)
        snapshot(level, "This isn't working. Trying new target.", 'pathtarget')
        console.warn('Try removing last target')
      } else {
        // try random target

        targets = targets.filter((r) => r !== target)
        if (targets.length === 0) targets = unconnected.filter((r) => r !== target)
        if (targets.length === 0) throw new Error('I give up.')
        snapshot(level, "This isn't working. Trying new target.", 'pathtarget')

        console.warn('Try random target')
      }
      continue // for console groups + errors
    }
    console.groupEnd()
  }
  console.groupEnd()
  return corridors
}

// TODO try original "connect actual closest first, link rooms later" algorithm for more randomness?
function connectRooms(level: CharMap, origin: Room, target: Room) {
  console.groupCollapsed(`Connect ${origin.label} to ${target.label}`)
  const currentMap = copy(level)
  const bannedOrigins: string[] = []

  const innerMax = 6
  let attempts = 0

  while (attempts++ < innerMax) {
    console.log('inner', attempts)

    // Select to and from pts
    let from: Point
    let froma = 0
    console.log('bannedOrigins:', bannedOrigins)
    do {
      from = origin.rect.rndPt()
    } while (bannedOrigins.includes(pt2s(from)) && froma++ < 20)
    // TODO get finite list of rect points?
    // TODO handle all points banned? currently goes back to just any
    console.log('froma:', froma)
    // target point
    const to = target.rect.rndPt()

    const path = createPath(from, to)

    // draw path start/end + banned origin pts
    let corrMap = digPts(currentMap, [from, to], 'p')
    corrMap = digPts(
      corrMap,
      bannedOrigins.map((p) => s2pt(p)),
      'x'
    )
    snapshot(corrMap, `Path ${origin.label} to ${target.label} ${attempts}/${innerMax}`)

    const valid = path.every((pt, i) => {
      console.log('path pt:', pt)
      const prev = i > 0 ? path[i - 1] : pt

      if ((currentMap[pt.y][pt.x] === 'w' && currentMap[prev.y][prev.x] === 'w') || currentMap[pt.y][pt.x] === 'c') {
        if (currentMap[pt.y][pt.x] === 'W') {
          console.log('Corner fail')
          corrMap = digPts(corrMap, [pt], 'x')
          snapshot(corrMap, 'Path failed - damaged room corner', 'pathfail')
        } else {
          console.log('Wall fail')
          corrMap = digPts(corrMap, [pt, prev], 'x')
          snapshot(corrMap, 'Path failed - damaged walls', 'pathfail')
        }
        // ban x and y pts
        origin.rect.traverse((x, y) => {
          console.log('traverse', x, y)
          if (x === from.x || y === from.y) bannedOrigins.push(pt2s({ x, y }))
        })
        return false
      }

      // dig visual
      corrMap = digRect(corrMap, Rect.scaled(pt.x, pt.y, 2, 2), 'w', 'crwp0123456789.xW')
      corrMap = digPt(corrMap, pt.x, pt.y, 'p')
      snapshot(corrMap, `Path ${origin.label} to ${target.label} ${attempts}/${innerMax}`, 'path')
      return true
    })

    if (valid) {
      // success
      console.log('Success')
      console.groupEnd()
      return path
    }
  }

  if (attempts == innerMax) {
    console.error(`connectRooms: max attempts exceeded ${attempts}/${innerMax}`)
  }
  console.groupEnd()
  return null
}

class Corridor {
  readonly points: Point[]
  readonly label: number
  constructor(points: Point[], label: number) {
    this.points = points
    this.label = label
  }
}

function createPath(from: Point, to: Point) {
  console.log(`createPath: (${from.x}, ${from.y}) to (${to.x}, ${to.y})`)
  const trailblazer = new ROT.Path.AStar(to.x, to.y, () => true, { topology: 4 })
  const path: Point[] = []
  trailblazer.compute(from.x, from.y, (x, y) => path.push({ x, y }))
  return path
}

// TODO start from wall instead of center point
function floodFind(origin: Room, targets: Room[], map: CharMap) {
  console.groupCollapsed(`flood ${origin.label} to closest target`)
  const useONeighbours = false
  const t = Date.now()
  // const start = pt2s({ x: origin.rect.cx, y: origin.rect.cy })
  const start = origin.border.toPts().map((pt) => pt2s(pt))
  let frontier = new Set<string>([...start])
  const searched = new Set<string>([...start])
  const hit: Point[] = []

  let flooda = 0
  const max = 100
  while (frontier.size > 0 && hit.length === 0 && flooda++ < max) {
    console.groupCollapsed(`Flood loop ${flooda} `)
    console.log('Frontier', frontier.size, frontier)
    const nextFrontier = new Set<string>()
    for (const pt of frontier) {
      searched.add(pt)

      // Check for hit
      const realpt = s2pt(pt)
      if (
        map[realpt.y][realpt.x] === 'w' &&
        !origin.border.intersectsPt(realpt) &&
        targets.some((r) => r.border.intersectsPt(realpt))
      ) {
        console.log('hit!')
        hit.push(realpt)
      } else {
        // not found, mark as reached and get unreached neighs for next round
        const neigh = useONeighbours ? getONeighbours(pt) : getNeighbours(pt)
        neigh.forEach((n) => {
          if (!searched.has(n) && !frontier.has(n)) {
            nextFrontier.add(n)
          }
        })
      }
    }

    // visual only
    const pts: Point[] = []
    frontier.forEach((p) => pts.push(s2pt(p)))
    let mark = digPts(map, pts, 'f')

    if (hit.length === 0) {
      // next wave
      console.log('check end')
      console.log('searched set:', searched)
      console.log('nextFrontier:', nextFrontier)
      frontier = new Set([...nextFrontier])
      snapshot(mark, `Flood find room ${origin.label} ` + flooda, 'flood')
    } else {
      // visual only
      console.log('hits found:', hit)
      mark = digPts(mark, hit, 'F')
      snapshot(mark, `Hit! ` + flooda, 'floodhit')
    }

    console.groupEnd()
  }

  console.warn(`Flood end ${Date.now() - t}ms`, flooda, max)

  const roomsFound = hit.map((h) => targets.find((r) => r.border.intersectsPt(h))) as Room[]
  const set = new Set<Room>([...roomsFound])
  console.log('roomsFound:', ...set)
  console.groupEnd()
  return ROT.RNG.getItem([...set])
}

// function createPointsMap() {
//   const map: Point[][] = createBlankMap({ x: -1, y: -1 })
//   map.forEach((row, y) =>
//     row.forEach((_, x) => {
//       map[y][x] = { x, y }
//     })
//   )

//   return map
// }

function getNeighbours(pStr: string): string[] {
  const p = s2pt(pStr)
  const neigh = []
  for (let yi = -1; yi <= 1; yi++) {
    for (let xi = -1; xi <= 1; xi++) {
      const x = p.x + xi
      const y = p.y + yi
      if (yi === 0 && xi === 0) continue // skip 0,0
      if (!inBoundsG(x, y)) continue // skip oob
      neigh.push(pt2s({ x: p.x + xi, y: p.y + yi }))
    }
  }

  return neigh
}

function getONeighbours(pStr: string): string[] {
  const p = s2pt(pStr)

  const pn = { x: p.x, y: p.y - 1 }
  const pe = { x: p.x + 1, y: p.y }
  const ps = { x: p.x, y: p.y + 1 }
  const pw = { x: p.x - 1, y: p.y }
  const neigh = [pn, pe, ps, pw]
  const valid = neigh.filter((n) => inBoundsG(n.x, n.y))
  return valid.map((v) => pt2s(v))
}

function pt2s(p: Point) {
  return p.x + '+' + p.y
}

function s2pt(s: string): Point {
  const p = s.split('+')
  return { x: parseInt(p[0]), y: parseInt(p[1]) }
}

// #endregion == Corridor ==

// #region ===== 3. Finalize =====

// some finishing touches
function createDoors(level: CharMap, rooms: Room[]) {
  // search room borders for '.', should be doorways
  const doorPts = rooms.map((room) => {
    return room.border.toPts(true).filter((pt) => inBoundsG(pt.x, pt.y) && level[pt.y][pt.x] === '.')
  })

  console.log('doorPts:', doorPts)

  const doorMap = digPts(level, doorPts.flat(), '+')
  snapshot(doorMap, 'The Doors', 'doors')

  return doorMap
}

function centerLevel(level: CharMap, rooms: Room[]) {
  const xmin = rooms.reduce((prev, curr) => (prev.border.x < curr.border.x ? prev : curr)).border.x
  const xmax = rooms.reduce((prev, curr) => (prev.border.x2 > curr.border.x2 ? prev : curr)).border.x2
  const dx = Math.floor((width - 1 - xmax - xmin) / 2)

  const ymin = rooms.reduce((prev, curr) => (prev.border.y < curr.border.y ? prev : curr)).border.y
  const ymax = rooms.reduce((prev, curr) => (prev.border.y2 > curr.border.y2 ? prev : curr)).border.y2
  const dy = Math.floor((height - 1 - ymax - ymin) / 2)

  console.log('Shift level:', dx, dy)

  let centeredLevel = level
  // transpose one at a time, for effect
  if (!(dy === 0)) {
    const yDir = dy < 0 ? -1 : 1
    for (let i = 0; i < Math.abs(dy); i++) centeredLevel = transposeLevelY(centeredLevel, yDir)
  }

  if (!(dx === 0)) {
    const xDir = dx < 0 ? -1 : 1
    for (let i = 0; i < Math.abs(dx); i++) centeredLevel = transposeLevelX(centeredLevel, xDir)
  }

  return centeredLevel
}

function transposeLevelX(level: CharMap, dir: number) {
  if (!(dir === -1 || dir === 1)) {
    console.warn('transposeLevelX: no', dir)
    return level
  }

  const centeredLevel = copy(level)
  if (dir === -1) {
    // move left
    level.forEach((_, yi) => {
      centeredLevel[yi].shift()
      centeredLevel[yi].push(' ')
    })
  } else if (dir === 1) {
    // move right
    centeredLevel.forEach((_, yi) => {
      centeredLevel[yi].pop()
      centeredLevel[yi].unshift(' ')
    })
  }
  snapshot(centeredLevel, 'Shift X', 'shift')

  return centeredLevel
}

function transposeLevelY(level: CharMap, dir: number) {
  if (!(dir === -1 || dir === 1)) {
    console.warn('transposeLevelY: no', dir)
    return level
  }

  const centeredLevel = copy(level)
  if (dir === -1) {
    // move up
    centeredLevel.shift()
    centeredLevel.push(new Array(width).fill(' '))
  } else if (dir === 1) {
    // move down
    centeredLevel.pop()
    centeredLevel.unshift(new Array(width).fill(' '))
  }
  snapshot(centeredLevel, 'Shift Y', 'shift')

  return centeredLevel
}

// #endregion

// #region ===== Digging =====

function digCorridor(map: CharMap, corridor: Corridor | Corridor[], char = '.', borderChar = 'w') {
  // ? a shorter list would be only overwrite blank or wall?
  const wallIgnore = 'crp0123456789.#W'
  const pIgnore = 'crp0123456789.W'
  let newMap = copy(map)
  const corridors: Corridor[] = Array.isArray(corridor) ? corridor : [corridor]

  corridors.forEach((c) => {
    for (const pt of c.points) {
      const wallRect = Rect.scaled(pt.x, pt.y, 2, 2)
      newMap = digRect(newMap, wallRect, borderChar[0], wallIgnore)
      newMap = digPt(newMap, pt.x, pt.y, char[0], pIgnore)
    }
  })

  return newMap
}

function digRoom(map: CharMap, room: Room | Room[], char: string, borderChar: string, showLabel = true, corners = '') {
  let newMap = copy(map)
  const rooms = Array.isArray(room) ? room : [room]

  rooms.forEach((r) => {
    newMap = digRect(newMap, r.border, borderChar)
    newMap = digRect(newMap, r.rect, char)
    if (showLabel) {
      newMap = digPt(
        newMap,
        r.rect.x2 - Math.floor(r.rect.width / 2),
        r.rect.y2 - Math.floor(r.rect.height / 2),
        r.label
      )
    }
    if (corners.length > 0) {
      newMap = digPts(
        newMap,
        [
          { x: r.border.x, y: r.border.y },
          { x: r.border.x2, y: r.border.y },
          { x: r.border.x, y: r.border.y2 },
          { x: r.border.x2, y: r.border.y2 },
        ],
        corners[0]
      )
    }
  })

  return newMap
}

function digRect(map: CharMap, rect: Rect, char: string, ignore = '') {
  const newLevel = copy(map)

  rect.traverse((x, y) => {
    if (inBounds(map, x, y) && !ignore.includes(newLevel[y][x])) newLevel[y][x] = char[0]
  })
  return newLevel
}

// TODO merge digPts
function digPt(map: CharMap, x: number, y: number, char: string, ignore = '') {
  const newMap = copy(map)
  if (inBounds(map, x, y) && !ignore.includes(map[y][x])) {
    newMap[y][x] = char[0]
  }

  return newMap
}

function digPts(map: CharMap, pts: Point[], char: string) {
  const newMap = copy(map)
  for (const pt of pts) {
    newMap[pt.y][pt.x] = char
  }

  return newMap
}

// function digFinal(rooms: Room[], corridors: Corridor[]) {
//   let map = createBlankMap()
//   map = digRoom(map, rooms, '.', '#', false)
//   map = digCorridor(map, corridors, '.', '#')
//   return map
// }

// #endregion

/// ======== Utility

function inBounds(map: CharMap, x: number, y: number, within = 0) {
  const xMax = map[0].length
  const yMax = map.length
  return x >= 0 + within && x < xMax - within && y >= 0 + within && y < yMax - within
}

function inBoundsG(x: number, y: number, within = 0) {
  return x >= 0 + within && x < width - 1 - within && y >= 0 + within && y < height - 1 - within
}

function rectInBounds(map: CharMap, rect: Rect, within = 0) {
  return inBounds(map, rect.x, rect.y, within) && inBounds(map, rect.x2, rect.y2, within)
}

function consoleLogMap(map: CharMap, group = false, label = 'CharMap') {
  group ? console.groupCollapsed(label) : console.group(label)
  // top border
  let top = '*\\'
  map[0].forEach((_, i) => {
    top += `${i % 10}`
  })
  console.log(top + '/')
  // main
  map.forEach((e, i) => {
    // console.log((i % 2 ? '{' : '>') + e.join('') + (i % 2 ? '<' : '}'))
    console.log((i % 10) + '>' + e.join('') + '<')
  })
  console.groupEnd()
}

function copy(map: CharMap): CharMap {
  return JSON.parse(JSON.stringify(map))
}

function rnd(min: number, max: number) {
  return ROT.RNG.getUniformInt(min, max)
}

function snapshot(map: CharMap, label = '(no label!)', group = '') {
  const snap = copy(map)
  // const h = getHistory()
  history.push([[label, group], ...snap])
}

// function getHistory() {
//   return history
// }

function createBlankMap(): CharMap {
  return [...new Array(height)].map(() => new Array(width).fill(' '))
}

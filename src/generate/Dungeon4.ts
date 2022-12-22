import * as ROT from 'rot-js'
import { Rect } from './Rectangle'

export type CharMap = string[][]
type Point = { x: number; y: number }

// --- Config ---
const maxRooms = 8
const maxRoomAttempts = 200
const levelEdge = 1
const roomBorderSize = 3

const minRoomXSize = 3
const maxRoomXSize = 6

const minRoomYSize = 2
const maxRoomYSize = 3

const maxCorridorAttempts = 10

// --- Globals ---
const history: CharMap[] = []
let current: CharMap = []
let width: number
let height: number

export function Dungeon4(w: number, h: number) {
  console.log('welcome... to dung4')
  width = w
  height = h

  current = [...new Array(height)].map(() => new Array(width).fill(' '))
  current = digRect(current, Rect.at(0, 0, width, height), '·')
  current = digRect(current, Rect.at(1, 1, width - 2, height - 2), ' ')

  snapshot(current, 'New', 'new')

  consoleLogMap(current, true)

  return { create, history, consoleLogMap }
}

function create() {
  // ROT.RNG.setSeed(123)
  console.log('create()', width, height, ROT.RNG.getSeed())

  const rooms = generateRooms()
  console.log('Done rooms:', rooms)

  const corridors = generateCorridors(rooms)
  console.log('Done corridors:', corridors)

  const final = digFinal(rooms, corridors)
  snapshot(final, 'Final', 'final')
}

// #region ===== Rooms =====

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
    const room = Room.scaled(
      rnd(0, width - 1),
      rnd(0, height - 1),
      rnd(minRoomXSize, maxRoomXSize),
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

// #region ===== Corridors ======
function generateCorridors(rooms: Room[]) {
  console.group('%c  generateCorridors()  ', 'background-color: cyan')
  const corridors: Corridor[] = []

  let unconnected = rooms

  // new level map
  let current = createBlankMap()
  rooms.forEach((r) => (current = digRoom(current, r, '.', 'w')))
  snapshot(current, 'Generate corridors', 'corrstart')

  let origin = unconnected[0]

  let attempts = 0
  while (unconnected.length > 0) {
    if (++attempts >= maxCorridorAttempts) {
      console.error('generateCorridors attempts exceeded', attempts, maxCorridorAttempts)
      break
    }
    console.groupCollapsed(`%cCreate corridor for Room ${origin.label}`, 'background-color: orange')

    let targets: Room[]

    if (unconnected.length === 1) {
      // last room, set origin, targets to any
      // ? always connect random for more random?
      origin = unconnected[0]
      targets = rooms
    } else {
      targets = unconnected
    }

    console.log(`Origin: ${origin.label}, Targets: ${targets.length}`)

    const target = floodFind(origin, targets, current)

    if (!target) throw new Error('We got nothing.')

    const innerMax = 10
    let innerAttempt = 0

    while (innerAttempt < innerMax) {
      innerAttempt++
      const from = origin.rect.rndPt()
      const to = target.rect.rndPt()

      const path = createPath(from, to)
      console.log('path:', path)
      let pathMap = digPts(current, [from, to], 'p')
      snapshot(pathMap, `Path: ${origin.label} to ${target.label}`)

      // new corridor map for checking valid corridors
      let corrMap = createBlankMap()
      corrMap = digRoom(corrMap, rooms, 'r', 'w', false)
      corrMap = digCorridor(corrMap, corridors, 'c', 'w')
      consoleLogMap(corrMap, true, 'corrMap')

      let pathI = 0
      let prev = path[0]
      let failed = false
      for (const pt of path) {
        // check for double wall breakage
        if (corrMap[pt.y][pt.x] === 'w' && corrMap[prev.y][prev.x] === 'w') {
          console.log('fail!')
          failed = true
          pathMap = digPts(pathMap, [pt, prev], 'x')
          snapshot(pathMap, 'Path failed - damaged walls', 'pathfail')
          break
        } else {
          prev = pt
          // visual
          const wallRect = Rect.scaled(pt.x, pt.y, 2, 2)
          pathMap = digRect(pathMap, wallRect, 'w', 'crwp0123456789.')
          pathMap = digPt(pathMap, pt.x, pt.y, 'p')

          snapshot(pathMap, 'Path ' + pathI, 'path')
          pathI++
        }
      }

      if (failed) continue

      // Success
      const newPath = path.slice(1, -1)
      const corridor = new Corridor(newPath, corridors.length)
      corridors.push(corridor)
      // DRY
      current = digRoom(current, rooms, '.', 'w', true)
      current = digCorridor(current, corridors, '.')

      snapshot(current, 'Corridor success!', 'corrsuccess')

      // remove connected from list
      // TODO rooms on the way
      unconnected = unconnected.filter((r) => r !== origin && r !== target)
      console.log('new unconnected:', unconnected)

      // draw corridor on maps

      origin = target
      break
    }

    console.groupEnd()
  }

  console.groupEnd()
  return corridors
  // console.groupEnd()
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
  console.log(`createPath: {${from.x}, ${from.y}} to {${to.x}, ${to.y}}`)
  const trailblazer = new ROT.Path.AStar(to.x, to.y, () => true, { topology: 4 })
  const path: Point[] = []
  trailblazer.compute(from.x, from.y, (x, y) => path.push({ x, y }))
  return path
}

function floodFind(origin: Room, targets: Room[], map: CharMap) {
  console.groupCollapsed(`%c Flood find from ${origin.label} `, 'background-color: orange')
  const useONeighbours = false
  const t = Date.now()
  const start = pt2s({ x: origin.rect.cx, y: origin.rect.cy })
  let frontier = new Set<string>([start])
  const searched = new Set<string>([start])
  const hit: Point[] = []
  const roomsHit: Room[] = []

  let flooda = 0
  const max = 60
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

// #endregion

function digCorridor(map: CharMap, corridor: Corridor | Corridor[], char = 'c', borderChar = 'w') {
  const wallIgnore = 'crp0123456789.#'
  const pIgnore = 'crp0123456789'
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

function digRoom(map: CharMap, room: Room | Room[], char: string, borderChar: string, showLabel = true) {
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

function digFinal(rooms: Room[], corridors: Corridor[]) {
  let map = createBlankMap()
  map = digRoom(map, rooms, '.', '#', false)
  map = digCorridor(map, corridors, '.', '#')
  return map
}

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
  history.push([[label, group], ...snap])
  // consoleLogMap(map, true)
}

function createBlankMap(): CharMap {
  return [...new Array(height)].map(() => new Array(width).fill(' '))
}
// function rndPt(map)

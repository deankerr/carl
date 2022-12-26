// TODO clean up duplicate functions/functionality, add later improvements to earlier stages
// TODO improve room gen (room size/w/h)
// ? 'grow rooms' at point to desired size?
// TODO reduce excess CharMap copies
// ? => encapsulate "level"/"current"/"visual" etc CharMaps to make copy/mutate easier/less error prone
// TODO smarter corridors
// TODO !!! save RNG state to replicate history as needed? !!!
// TODO submodule selection that isn't just commenting in/out desired modules
// ? Vis reads colour pallette (etc) for modules? tag in history
// ? Better encapsulate "dig"/visual only/level data structure
// ? unit tests
// ? ROT getWeightedValue for room size distribution?
// TODO return Room[], Corridor[] along with data
// TODO Maybe: abandon charmaps entirely, send rects lists to vis with color tags? way faster, i don't seem to actually need them now

import * as ROT from 'rot-js'
import { Rect } from './Rectangle'
import { digCorridor, digRect, digRoom, digPts } from './dungeon4/dig'

export type Dungeon4Data = [number[][], Point[]]
export type CharMap = string[][]
export type Point = { x: number; y: number }

// TODO make room + walls the canonical way of using rooms
export class Room {
  readonly rect: Rect
  readonly label: string
  border: Rect

  constructor(rect: Rect, label: string | number, borderSize: number) {
    this.rect = rect
    this.label = `${label}`
    this.border = rect.scale(borderSize)
  }

  static scaled(x: number, y: number, xScale: number, yScale: number, label: string | number = '?', borderSize = 1) {
    const rect = Rect.scaled(x, y, xScale, yScale)

    return new Room(rect, label, borderSize)
  }
}
export class Corridor {
  readonly points: Point[]
  readonly label: number
  constructor(points: Point[], label: number) {
    this.points = points
    this.label = label
  }
}

// todo handle this better
// import { generateRoomsClassic as generateRooms } from './dungeon4/generateRoomsClassic'
import { generateRoomsBSP as generateRooms } from './dungeon4/generateRoomsBSP'

export interface GEN_CONFIG {
  width: number
  height: number
  minRooms: number
  maxRooms: number
  minRoomW: number
  maxRoomW: number
  minRoomH: number
  maxRoomH: number
  levelEdge: number
  shiftFinal: boolean
}

// TODO should pass this into Dungeon4 + use this as default
const DEFAULT_CONFIG: GEN_CONFIG = {
  // level size
  width: 80,
  height: 20,

  // number of rooms
  minRooms: 6,
  maxRooms: 9,

  // room width
  minRoomW: 5,
  maxRoomW: 13,

  // room height
  minRoomH: 3,
  maxRoomH: 7,

  // avoid placing features within this range of the level edge
  levelEdge: 1,

  shiftFinal: true,
}

let CONFIG: GEN_CONFIG

const maxCorridorAttempts = 50

// --- Globals ---
export let history: CharMap[]
let current: CharMap = []

// TODO config object
export function dungeon4(newConfig?: Partial<GEN_CONFIG>): Dungeon4Data | null {
  const time = Date.now()
  console.log('%c   Welcome to Dungeon4   ', 'background-color: pink; font-weight: bold')

  // set up
  if (newConfig) CONFIG = { ...DEFAULT_CONFIG, ...newConfig }
  else CONFIG = { ...DEFAULT_CONFIG }
  console.log('CONFIG:', CONFIG)

  current = [...new Array(CONFIG.height)].map(() => new Array(CONFIG.width).fill(' '))
  current = digRect(current, Rect.at(0, 0, CONFIG.width, CONFIG.height), '·')
  current = digRect(current, Rect.at(1, 1, CONFIG.width - 2, CONFIG.height - 2), ' ')

  // wipe old history (store this?)
  history = []

  snapshot(current, 'Start')

  const seed = ROT.RNG.getUniformInt(1000, 9999)
  ROT.RNG.setSeed(seed)

  console.log('create() W:', CONFIG.width, 'H:', CONFIG.height, ROT.RNG.getSeed())

  // ? modules handle timing, report with data? eg const [ rooms, time ] = gen()
  const tRooms = Date.now()
  const rooms = generateRooms(CONFIG) // give min / max room amounts?
  const tRoomsEnd = Date.now() - tRooms
  if (rooms === null) {
    console.warn('rooms == null, aborting')
    return null
  }

  const tCorr = Date.now()
  const corridors = generateCorridors(rooms)
  const tCorrEnd = Date.now() - tCorr

  const [final, doorPts] = finalize(rooms, corridors)

  const terrain = generateTerrainData(final)

  const t = Date.now() - time
  snapshot(final, 'Complete! Time: ' + t + 'ms', 'done')

  const logMsg = `%c Dungeon4 Complete (${t}ms), Rooms: ${rooms.length} (${tRoomsEnd}ms), Corridors: ${corridors.length} (${tCorrEnd}ms) `
  consoleLogMap(final, true, logMsg, 'background-color: pink')

  return [terrain, doorPts]
}

// #region ===== 2. Corridors ======
// TODO Better console log output
function generateCorridors(rooms: Room[]) {
  console.groupCollapsed('%c  generateCorridors()  ', 'background-color: cyan')
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

/*
  refactor to something like
  connect(origin, closest, attempts=5)
  if fail connect(origin, anyconnected, attempts=5)
  if fail connect(origin, any, 10)
  etc
  / 
  connect(first, closest)
  while unconnected:
  connect(unconnected, connected)
  connect(connected, closest)
  if random() connect(connected, any)
  connect(closest, furthest)

  try 1 space border between corridoors/any?

  another start: connect corridors in array order 0 <- 1, 1 <- 2, 3 <- n (looks random?)

  current classic "connect to closest unconnected" makes boring linear dungeons
*/

// TODO try original "connect actual closest first, link rooms later" algorithm for more randomness?
function connectRooms(level: CharMap, origin: Room, target: Room) {
  console.groupCollapsed(`Connect ${origin.label} to ${target.label}`)
  const currentMap = copy(level)
  const bannedOrigins: string[] = []

  const innerMax = 4
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
        if (currentMap[pt.y][pt.x] === 'c') {
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
      corrMap = digPts(corrMap, pt, 'p')
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

function createPath(from: Point, to: Point) {
  console.log(`createPath: (${from.x}, ${from.y}) to (${to.x}, ${to.y})`)
  const trailblazer = new ROT.Path.AStar(to.x, to.y, () => true, { topology: 4 })
  const path: Point[] = []
  trailblazer.compute(from.x, from.y, (x, y) => path.push({ x, y }))
  return path
}

// ? custom "PointsSet" would be useful here
function floodFind(origin: Room, targets: Room[], map: CharMap) {
  console.groupCollapsed(`flood ${origin.label} to closest target`)
  const useONeighbours = true // config
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

// ? Points Manager and/or Points Set?

// function createPointsMap() {
//   // const map: Point[][] = createBlankMap({ x: -1, y: -1 })
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
      if (!inBounds(x, y)) continue // skip oob
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
  const valid = neigh.filter((n) => inBounds(n.x, n.y))
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
function finalize(rooms: Room[], corridors: Corridor[]): [CharMap, Point[]] {
  // Assemble the complete level
  let final = createBlankMap()
  final = digRoom(final, rooms, '.', '#', false)
  final = digCorridor(final, corridors, '.', '#')

  const [finalD, doorPts] = createDoors(final, rooms)

  if (CONFIG.shiftFinal) {
    const [finalS, dx, dy] = centerLevel(finalD, rooms)
    const shiftPts = doorPts.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }))
    return [finalS, shiftPts]
  }
  return [finalD, doorPts]
}

function createDoors(level: CharMap, rooms: Room[]): [CharMap, Point[]] {
  // search room borders for '.', should be doorways
  const doorPts = rooms.map((room) => {
    return room.border.toPts(true).filter((pt) => inBounds(pt.x, pt.y) && level[pt.y][pt.x] === '.')
  })

  // console.log('doorPts:', doorPts)

  const doorMap = digPts(level, doorPts.flat(), '+')
  // snapshot(doorMap, 'The Doors', 'doors') // !

  // flat() removes which room is associated with each room
  return [doorMap, doorPts.flat()]
}

function centerLevel(level: CharMap, rooms: Room[]): [CharMap, number, number] {
  const xMin = rooms.reduce((prev, curr) => (prev.border.x < curr.border.x ? prev : curr)).border.x
  const xMax = rooms.reduce((prev, curr) => (prev.border.x2 > curr.border.x2 ? prev : curr)).border.x2
  const dx = Math.floor((CONFIG.width - 1 - xMax - xMin) / 2)

  const yMin = rooms.reduce((prev, curr) => (prev.border.y < curr.border.y ? prev : curr)).border.y
  const yMax = rooms.reduce((prev, curr) => (prev.border.y2 > curr.border.y2 ? prev : curr)).border.y2
  const dy = Math.floor((CONFIG.height - 1 - yMax - yMin) / 2)

  dx !== 0 && dy !== 0 && console.log(`Shift level: x ${dx} y: ${dy}`)

  let centeredLevel = level
  // transpose one at a time, for effect
  // ? try skipping if only 1 move
  if (dy < -1 || dy > 1) {
    const yDir = dy < 0 ? -1 : 1
    for (let i = 0; i < Math.abs(dy); i++) centeredLevel = transposeLevelY(centeredLevel, yDir)
  }

  // if (!(dx === 0)) {
  if (dx < -1 || dx > 1) {
    const xDir = dx < 0 ? -1 : 1
    for (let i = 0; i < Math.abs(dx); i++) centeredLevel = transposeLevelX(centeredLevel, xDir)
  }

  return [centeredLevel, dx, dy]
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
    centeredLevel.push(new Array(CONFIG.width).fill(' '))
  } else if (dir === 1) {
    // move down
    centeredLevel.pop()
    centeredLevel.unshift(new Array(CONFIG.width).fill(' '))
  }
  snapshot(centeredLevel, 'Shift Y', 'shift')

  return centeredLevel
}

// #endregion

/// ======== Utility

export function inBounds(x: number, y: number, within = 0) {
  return x >= 0 + within && x < CONFIG.width - within && y >= 0 + within && y < CONFIG.height - within
}

export function rectInBounds(rect: Rect, within = 0) {
  return inBounds(rect.x, rect.y, within) && inBounds(rect.x2, rect.y2, within)
}

export function snapshot(map: CharMap, label: string | number = '(no label!)', group = '') {
  const snap = copy(map)

  history.push([[`${label}`, group], ...snap])
}

export function createBlankMap(c = ' '): CharMap {
  return [...new Array(CONFIG.height)].map(() => new Array(CONFIG.width).fill(c[0]))
}

// rot-js style 0/1 terrain map for game
function generateTerrainData(level: CharMap): number[][] {
  return level.map((row) => row.map((e) => ('.+'.includes(e) ? 0 : 1)))
}

export function consoleLogMap(map: CharMap, group = false, label = 'CharMap', style = '') {
  group ? console.groupCollapsed(label, style) : console.group(label, style)
  // top border
  let top = '*\\'
  map[0].forEach((_, i) => {
    top += `${i % 10}`
  })
  console.log(top + '/')

  map.forEach((e, i) => {
    console.log((i % 10) + '>' + e.join('') + '<')
  })
  console.groupEnd()
}

export function copy(map: CharMap): CharMap {
  return JSON.parse(JSON.stringify(map))
}

export function rnd(min: number, max: number) {
  return ROT.RNG.getUniformInt(min, max)
}

// random odd int
export function rndO(min: number, max: number) {
  let n
  do {
    n = rnd(min, max)
  } while (n % 2 === 0)
  return n
}

export function isOdd(n: number) {
  return n % 2 == 1
}

// make a number odd, by squishing it a bit
export function odd(n: number) {
  return isOdd(n) ? n : n - 1
}

export function clamp(min: number, n: number, max: number, debug = false) {
  debug && console.log(`clamp ${n} - min: ${min} ${n < min} / max: ${max} ${n > max}`)
  if (n < min) return min
  if (n > max) return max
  return n
}

export function max(n: number, max: number) {
  return n < max ? n : max
}

export function floor(n: number) {
  return Math.floor(n)
}

export function half(n: number) {
  return Math.floor(n / 2)
}

export function larger(n1: number, n2: number) {
  return n1 >= n2 ? n1 : n2
}

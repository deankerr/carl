// TODO refactor every single thing
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

// my original corridor generator. It makes fairly linear dungeons, is slow and often fails.

import * as ROT from 'rot-js'
import { CharMap, copy, Corridor, createBlankMap, inBounds, Point, Room, snapshot } from './dungeon4'
import { Rect } from '../Rectangle'
import { digCorridor, digPts, digRect, digRoom } from './dig'

const maxCorridorAttempts = 50

export function generateCorridorsClassic(rooms: Room[]): [Corridor[], number] {
  const timer = Date.now()
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
  const timerEnd = Date.now() - timer
  console.log(`Time: ${timerEnd}ms`)
  console.groupEnd()

  return [corridors, timerEnd]
}

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
    snapshot(corrMap, `Path ${origin.label} to ${target.label} ${attempts}/${innerMax}`, 'path')

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

// ? Points Manager / Points Set?

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

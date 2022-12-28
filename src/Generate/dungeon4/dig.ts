import { CharMap, Room, Corridor, Point } from './dungeon4'
import { Rect } from '../Rectangle'
import { inBounds, copy } from './dungeon4'

export function digCorridor(map: CharMap, corridor: Corridor | Corridor[], char = '.', borderChar = 'w') {
  // ? a shorter list would be only overwrite blank or wall?
  const wallIgnore = 'crp0123456789.#W'
  const pIgnore = 'crp0123456789.W'
  let newMap = copy(map)
  const corridors: Corridor[] = Array.isArray(corridor) ? corridor : [corridor]

  corridors.forEach((c) => {
    for (const pt of c.points) {
      const wallRect = Rect.scaled(pt.x, pt.y, 2, 2)
      newMap = digRect(newMap, wallRect, borderChar[0], wallIgnore)
      newMap = digPts(newMap, pt, char[0], pIgnore)
    }
  })

  return newMap
}

export function digRoom(
  map: CharMap,
  room: Room | Room[],
  char: string,
  borderChar: string,
  showLabel = true,
  corners = ''
) {
  let newMap = copy(map)
  const rooms = Array.isArray(room) ? room : [room]

  rooms.forEach((r) => {
    newMap = digRect(newMap, r.border, borderChar)
    newMap = digRect(newMap, r.rect, char)
    if (showLabel) {
      newMap = digPts(newMap, { x: r.rect.cx, y: r.rect.cy }, r.label)
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

export function digRect(map: CharMap, rect: Rect, char: string | number, ignore = '') {
  const newLevel = copy(map)
  const c = `${char}`[0]
  rect.traverse((x, y) => {
    if (inBounds(x, y) && !ignore.includes(newLevel[y][x])) newLevel[y][x] = c
  })
  return newLevel
}

export function digRectCycleChars(map: CharMap, rect: Rect, char: string | number, ignore = '') {
  const newLevel = copy(map)
  const c = `${char}`
  const l = c.length
  let i = 0
  rect.traverse((x, y) => {
    if (inBounds(x, y) && !ignore.includes(newLevel[y][x])) newLevel[y][x] = c[i++ % l]
  })
  return newLevel
}

export function digPts(map: CharMap, points: Point | Point[], char: string, ignore = '') {
  const pts = Array.isArray(points) ? points : [points]
  const newMap = copy(map)
  for (const pt of pts) {
    if (inBounds(pt.x, pt.y) && !ignore.includes(newMap[pt.y][pt.x])) newMap[pt.y][pt.x] = char
  }

  return newMap
}

// function digFinal(rooms: Room[], corridors: Corridor[]) {
//   let map = createBlankMap()
//   map = digRoom(map, rooms, '.', '#', false)
//   map = digCorridor(map, corridors, '.', '#')
//   return map
// }

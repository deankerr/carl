import * as ROT from 'rot-js'
import { Rect } from './Rectangle'

type CharMap = string[][]
// --- Config ---
const maxRooms = 5
const maxRoomAttempts = 20

const roomSize = 3 // TODO vary

// --- Globals ---
const history: CharMap[] = []
let level: CharMap = []
let width: number
let height: number

export function Dungeon4(w: number, h: number) {
  console.log('welcome... to dung4')
  width = w
  height = h

  level = [...new Array(height)].map(() => new Array(width).fill(' '))
  history.push(copy(level))

  consoleLogMap(level, true)

  return { create, history }

  // ========== End of main ==========

  // ======== Rooms ========
}

function create() {
  console.log('create()', width, height)

  const rooms = generateRooms()
  // console.log(rooms)
  // history.push(copy(level))

  // rooms.forEach((r) => (level = digRect(level, r, 'r')))
  // consoleLogMap(level)

  // ! intersects test
  const r1 = Rect.at(1, 1, 4, 4)
  const r2 = Rect.at(10, 10, 4, 4)
  level = digRect(level, r1, '1')
  level = digRect(level, r2, '2')

  console.log('r1 i r2')
  console.log(r1.intersects(r2))
  console.log('r2 i r1')
  console.log(r2.intersects(r1))

  const r3 = Rect.at(2, 2, 4, 4)
  console.log('r3:', r3)
  level = digRect(level, r3, '3')

  console.log('r3 i r1')
  console.log(r3.intersects(r1))

  const r4 = Rect.at(4, 2, 4, 4)
  // level = digRect(level, r4, '4')

  console.log('r3 i [r1, r2, r4]')
  console.log(r3.intersects([r1, r2, r4]))
  // console.log('r3 i r1', r3.intersects(r1))

  // const r4 = Rect.at(6, 2, 4, 4)
  // level = digRect(level, r4, '4')
  // consoleLogMap(level)

  // console.log('r3 i r1', r3.intersects(r1))
  // console.assert(r3.intersects(r1) != null)

  // console.log('r3 i r2', r3.intersects(r2))
  // console.assert(r3.intersects(r2) == null)

  // console.log('r3 i r4', r3.intersects(r4))

  // console.log('r3 i [r1, r2, r4]', r3.intersects([r1, r2, r4]))
  consoleLogMap(level)
}

function generateRooms(): Room[] {
  let attempts = 0
  const rooms: Room[] = []
  while (++attempts < maxRoomAttempts && rooms.length < maxRooms) {
    const room = Room.scaled(rnd(0, width - 1), rnd(0, height - 1), roomSize, roomSize)
    room.label = rooms.length.toString()

    if (roomInBounds(room)) {
      rooms.push(room)
    }
  }
  return rooms
}

function roomInBounds(room: Room) {
  return rectInBounds(level, room.rect)
}

class Room {
  label: string | undefined // ? do we need this
  rect: Rect

  constructor(rect: Rect) {
    this.rect = rect
  }

  static scaled(x: number, y: number, xScale: number, yScale: number) {
    const rect = Rect.scaled(x, y, xScale, yScale)

    return new Room(rect)
  }
}

function digRect(map: CharMap, e: Rect | Room, char: string) {
  // console.log('digRect')
  const newLevel = copy(map)
  const rect = e instanceof Room ? e.rect : e

  rect.traverse((x, y) => {
    newLevel[y][x] = char[0]
  })
  return newLevel
}

/// ======== Utility

function inBounds(map: CharMap, x: number, y: number) {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length
}

function rectInBounds(map: CharMap, rect: Rect) {
  const xMax = map[0].length
  const yMax = map.length
  return rect.x > 0 && rect.x2 < xMax && rect.y > 0 && rect.y2 < yMax
}

function consoleLogMap(map: CharMap, group = false) {
  group && console.groupCollapsed('CLOG')
  map.forEach((e, i) => {
    console.log((i % 2 ? '{' : '>') + e.join('') + (i % 2 ? '<' : '}'))
  })
  group && console.groupEnd()
}

function copy(map: CharMap): CharMap {
  return JSON.parse(JSON.stringify(map))
}

function rnd(min: number, max: number) {
  return ROT.RNG.getUniformInt(min, max)
}
// function rndPt(map)

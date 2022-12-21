import * as ROT from 'rot-js'
import { Rect } from './Rectangle'

type CharMap = string[][]
// --- Config ---
const maxRooms = 5
const maxRoomAttempts = 20

const roomSize = 3 // TODO vary

// --- Globals ---
const history: CharMap[] = []

export function Dungeon4(width: number, height: number) {
  console.log('welcome... to dung4')

  let level: CharMap = [...new Array(height)].map(() => new Array(width).fill(' '))

  history.push(copy(level))

  consoleLogMap(level, true)

  const rooms = generateRooms()
  console.log(rooms)
  history.push(copy(level))

  rooms.forEach((r) => (level = digRect(level, r, 'r')))
  consoleLogMap(level)

  // ========== End of main ==========

  // ======== Rooms ========
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
}

// function createRooms(map: CharMap, rooms: Room[], attempts = 0) {
//   console.log('attempts', attempts)
//   const room = createRoom(map)

//   if (roomInBounds(map, room)) {
//     room.label = rooms.length.toString()
//     rooms = [room, ...rooms]
//   }

//   if (attempts < maxRoomAttempts && rooms.length < maxRooms) createRooms(map, rooms, ++attempts)
// }

// function cr2(max: number[], attempts = 0) {
//   console.log('cr2', attempts)
//   const room = createRoom(map)

// }

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

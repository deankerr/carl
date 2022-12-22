import * as ROT from 'rot-js'
import { Rect } from './Rectangle'

type CharMap = string[][]
// --- Config ---
const maxRooms = 5
const maxRoomAttempts = 20

const roomSize = 3 // TODO vary
// ---

export function Dungeon4(width: number, height: number) {
  console.log('welcome... to dung4')

  let level: CharMap = [...new Array(height)].map(() => new Array(width).fill(' '))

  const room = Room.scaled(0, 3, 4, 4)
  // level = digRect(level, room, 'r')
  consoleLogMap(level)

  const rooms: Room[] = []
  // TODO createRooms
  createRooms(level, rooms)
  console.log(rooms)
  // rooms.forEach((r) => (level = digRect(level, r, 'r')))
  for (const r of rooms) {
    console.log(r)
    level = digRect(level, r, 'r')
  }
  consoleLogMap(level)
}

// ========== End of main ==========

// ======== Rooms ========
function createRooms(map: CharMap, rooms: Room[], attempts = 0) {
  console.log('attempts', attempts)
  const room = createRoom(map)

  if (roomInBounds(map, room)) {
    room.label = rooms.length.toString()
    rooms.push(room)
  }

  if (attempts < maxRoomAttempts && rooms.length < maxRooms) createRooms(map, rooms, ++attempts)
}

function createRoom(map: CharMap): Room {
  const x = ROT.RNG.getUniformInt(0, map[0].length)
  const y = ROT.RNG.getUniformInt(0, map.length)

  return Room.scaled(x, y, roomSize, roomSize)
}

class Room extends Rect {
  label: string | undefined // ? do we need this

  static scaled(x: number, y: number, xScale: number, yScale: number) {
    const width = 2 * xScale - 1
    const height = 2 * yScale - 1
    const x1 = x - Math.floor(width / 2)
    const y1 = y - Math.floor(height / 2)

    return new Room(x1, y1, width, height)
  }
}

// interface Room
// ========

function digRect(map: CharMap, rect: Rect | Room, char: string) {
  const newLevel = copy(map)

  rect.traverse((x, y) => {
    newLevel[y][x] = char[0]
  })
  return newLevel
}

/// ======== Utility

function inBounds(map: CharMap, x: number, y: number) {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length
}

function roomInBounds(map: CharMap, room: Room) {
  return (
    inBounds(map, room.x, room.y) &&
    inBounds(map, room.x2, room.y) &&
    inBounds(map, room.x, room.y2) &&
    inBounds(map, room.x2, room.y2)
  )
}

function consoleLogMap(map: CharMap) {
  // console.groupCollapsed('CLOG ' + msg)
  map.forEach((e, i) => {
    console.log((i % 2 ? '{' : '>') + e.join('') + (i % 2 ? '<' : '}'))
  })
  // console.groupEnd()
}

function copy(map: CharMap): CharMap {
  return JSON.parse(JSON.stringify(map))
}

// function rndPt(map)

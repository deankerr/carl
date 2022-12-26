import { createBlankMap, rectInBounds, Room, snapshot, rnd } from '../dungeon4'
// import { Rect } from '../Rectangle'
import { digRect, digRoom } from './dig'

// my original random room implementation

// ? config object to pass to arbitrary room/corr/etc. modules?
// -- only classic uses this?
const maxRooms = 8
const maxRoomAttempts = 500
const levelEdge = 1

// i messed with these during testing and cant remember whats good
const minRoomXSize = 5
const maxRoomXSize = 7

const minRoomYSize = 3
const maxRoomYSize = 3
// --

// type Config = {
//   maxRooms: number
//   maxRoomAttempts: number
//   minRoomXSize: number
//   maxRoomXSize: number
//   minRoomYSize: number
//   maxRoomYSize: number
//   levelEdge: number
//   roomBorderSize: number
// }

export function generateRoomsClassic(): Room[] {
  const trooms = Date.now()
  console.groupCollapsed('%c  generateRoomsClassic()  ', 'background-color: cyan')
  let attempts = 0
  const rooms: Room[] = []
  let current = createBlankMap()
  const width = current[0].length
  const height = current.length

  while (rooms.length < maxRooms) {
    if (++attempts >= maxRoomAttempts) {
      console.error('Max attempts exceeded', attempts, maxRoomAttempts)
      break
    }

    console.log(`%cGenerate room attempt: ${attempts}`, 'background-color: orange')

    // lazily encourage larger, more horizontal rooms until later
    let xs: number
    if (attempts / maxRoomAttempts < 0.5) {
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
      snapshot(failed, 'Failed - out of bounds', 'roomfail')
      continue
    }

    if (!roomSpaceValid(room, rooms)) {
      console.log('fail: invalid')
      const failed = digRect(current, room.rect, 'x')
      snapshot(failed, 'Failed - overlaps room boundary', 'roomfail')
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
  console.log(`Complete - Rooms: ${rooms.length} Attempts: ${attempts} Time: ${Date.now() - trooms}ms`)
  return rooms

  // Room must be in level bounds, and not touching an edge
  function roomInBounds(room: Room) {
    return rectInBounds(room.rect, levelEdge)
  }

  // Room can't overlap other room's borders
  function roomSpaceValid(newRoom: Room, currentRooms: Room[]) {
    const result = currentRooms.every((r) => {
      return r.border.intersects(newRoom.rect) === null
    })

    return result
  }
}

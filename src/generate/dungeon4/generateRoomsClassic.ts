import { GEN_CONFIG, createBlankMap, rectInBounds, Room, snapshot, rnd } from '../dungeon4'
import { digRect, digRoom } from './dig'

// my original random room placement implementation

// Classic specific configs kept for compatibility
const minRoomXSize = 5
const maxRoomXSize = 7
const minRoomYSize = 3
const maxRoomYSize = 3
const maxRoomAttempts = 500

let CONFIG: GEN_CONFIG

export function generateRoomsClassic(newConfig: GEN_CONFIG): [Room[], number] {
  const timer = Date.now()
  console.groupCollapsed('%c  generateRoomsClassic()  ', 'background-color: cyan')

  CONFIG = { ...newConfig }

  let attempts = 0
  const rooms: Room[] = []
  let current = createBlankMap()
  const width = current[0].length
  const height = current.length

  while (rooms.length < CONFIG.maxRooms) {
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
  const timerEnd = Date.now() - timer
  console.log(`Complete - Rooms: ${rooms.length} Attempts: ${attempts} Time: ${timerEnd}ms`)

  return [rooms, timerEnd]

  // Room must be in level bounds, and not touching an edge
  function roomInBounds(room: Room) {
    return rectInBounds(room.rect, CONFIG.levelEdge)
  }

  // Room can't overlap other room's borders
  function roomSpaceValid(newRoom: Room, currentRooms: Room[]) {
    const result = currentRooms.every((r) => {
      return r.border.intersects(newRoom.rect) === null
    })

    return result
  }
}

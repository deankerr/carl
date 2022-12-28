import { createBlankMap, snapshot, rnd, CharMap, Room, floor, rndO, max, GEN_CONFIG } from './dungeon4'
import { digRect, digRectCycleChars, digRoom } from './dig'
import { Rect } from '../Rectangle'

// a (sort of) Binary Space Partition based room generator

interface BSP_CONFIG extends GEN_CONFIG {
  minSectorW: number
  minSectorH: number
}

let CONFIG: BSP_CONFIG
let current: CharMap

// ? try ROT getNormal for split pos
// ? handle very large areas left after main loop
// ? force initial splits to be very different?
// null = abort
export function generateRoomsBSP(newConfig: GEN_CONFIG): [Room[], number] {
  const timer = Date.now()
  console.groupCollapsed('%c  generateRoomsBSP() ', 'background-color: cyan')

  CONFIG = { minSectorW: floor(newConfig.minRoomW * 2), minSectorH: floor(newConfig.minRoomH * 2), ...newConfig }

  const roomsTarget = rnd(CONFIG.minRooms, CONFIG.maxRooms)
  console.log(
    `Rooms: ${CONFIG.minRooms}<=${roomsTarget}<=${CONFIG.maxRooms}, Min sector size W:${CONFIG.minSectorW}*H:${CONFIG.minSectorH}`
  )

  current = createBlankMap('*')
  const levelMaxX = current[0].length - 1
  const levelMaxY = current.length - 1

  // create initial sector
  const initialRect = Rect.atxy2(
    CONFIG.levelEdge,
    CONFIG.levelEdge,
    levelMaxX - CONFIG.levelEdge,
    levelMaxY - CONFIG.levelEdge
  )
  initialRect.id = 0

  // create queue
  const queue = [initialRect]
  const complete: Rect[] = [] // keep sectors that can't be split here instead of on the queue
  let sectorN = 0 // used for sector ids

  // draw first sector
  current = digRectCycleChars(current, initialRect, 0 + ' ')
  snapshot(current, `BSP Target: ${roomsTarget}, Sectors ${queue.length}`, 'bsp')

  const max = 20
  let i = 0
  // === main loop ===
  while (i++ < max && complete.length + queue.length < roomsTarget) {
    const parent = queue.shift() // shift/pop? alternate? fun can be had here to create weird dungeons
    if (!parent) {
      console.groupEnd()
      console.warn('No more sectors in queue')
      break
    }

    console.groupCollapsed(
      `%c Sector Loop - Current: ${parent.id}, Queue: ${queue.map((r) => r.id)} `,
      'background-color: orange'
    )
    console.log('Parent:', parent)

    const children = split(parent)
    console.log('Children:', children)

    if (children.length === 0) {
      // Move sector to complete
      complete.push(parent)
      console.groupEnd()
      continue
    }

    // Draw new sectors
    const [child1, child2] = children

    child1.id = ++sectorN
    current = digRectCycleChars(current, child1, (child1.id % 10) + ' ')

    child2.id = ++sectorN
    current = digRectCycleChars(current, child2, (child2.id % 10) + ' ')
    snapshot(current, `BSP Target: ${roomsTarget}, Sectors ${queue.length}`, 'bsp')

    // Add new children to queue
    queue.push(...children)

    // * experiment - sort queue largest -> smallest
    queue.sort((a, b) => b.width * b.height - a.width * a.height)
    console.table(queue)
    console.groupEnd()
  }
  // === end of main loop ===

  // collect completed + remaining enqueued sectors
  const sectors = complete.concat(queue)

  if (i >= max) console.error(`BSP maximum attempts exceeded ${i}/${max}`)

  console.group('Sectors:')
  console.table(sectors)
  console.groupEnd()

  // blank sector space
  sectors.forEach((s) => (current = digRect(current, s, ' ')))
  snapshot(current, `Bisect Complete ${sectors.length}/${roomsTarget}`, 'bspsuccess')

  const rooms = createRooms(current, sectors)

  console.group('Rooms:')
  console.table(sectors)
  console.groupEnd()

  const timerEnd = Date.now() - timer
  console.log(`Time: ${timerEnd}ms`)
  console.groupEnd()

  return [rooms, timerEnd]
}

function split(parent: Rect) {
  // Decide which axis to split
  const canSplitVert = parent.width > CONFIG.minSectorW * 2 + 1
  const canSplitHori = parent.height > CONFIG.minSectorH * 2 + 1

  if (!canSplitVert && !canSplitHori) {
    console.log('Rect', parent.id, 'can no longer be split')
    return []
  }

  // true = split vertically, false = horizontal
  let splitV: boolean

  if (canSplitVert && canSplitHori) rnd(0, 1) ? (splitV = true) : (splitV = false)
  else if (canSplitVert) splitV = true
  else splitV = false

  // Set up chosen axis
  const min = splitV ? parent.x + CONFIG.minSectorW : parent.y + CONFIG.minSectorH
  const max = splitV ? parent.x2 - CONFIG.minSectorW : parent.y2 - CONFIG.minSectorH

  // choose a random point, leaving enough room for the min sector size
  const splitPt = rnd(min, max)

  // Split!
  if (min > max || max < min) throw new Error('Wacky min/max: ' + min + ' ' + max)
  else console.log(`Splitting sector ${parent.id} Vert=${splitV}`, 'min', min, 'max', max, 'pt:', splitPt)

  // --- visual only - draw line
  const lineRect = splitV
    ? Rect.atxy2(splitPt, parent.y, splitPt, parent.y2)
    : Rect.atxy2(parent.x, splitPt, parent.x2, splitPt)

  current = digRect(current, lineRect, splitV ? '|' : '-')
  // ------

  // Birth children
  const child1 = splitV
    ? Rect.atxy2(parent.x, parent.y, splitPt - 1, parent.y2)
    : Rect.atxy2(parent.x, parent.y, parent.x2, splitPt - 1)

  const child2 = splitV
    ? Rect.atxy2(splitPt + 1, parent.y, parent.x2, parent.y2)
    : Rect.atxy2(parent.x, splitPt + 1, parent.x2, parent.y2)

  return [child1, child2]
}

// TODO better control of room size distribution
function createRooms(current: CharMap, rects: Rect[]) {
  console.log('createRooms()')

  const rooms = rects.map((parent, i) => {
    // blank sector
    // current = digRectCycleChars(current, parent, ' ')

    // randomly shift the room within the sector
    let w = CONFIG.maxRoomW,
      h = CONFIG.maxRoomH
    let at = 0
    do {
      if (at++ > 100) {
        console.warn('bad room!', i)
        break
      }
      // big big rooms (too big)
      // w = larger(
      //   rndO(CONFIG.minRoomW, max(parent.width - 2, CONFIG.maxRoomW)),
      //   rndO(CONFIG.minRoomW, max(parent.width - 2, CONFIG.maxRoomW))
      // )
      // h = larger(rndO(CONFIG.minRoomH, parent.height - 2), rndO(CONFIG.minRoomH, parent.height - 2))
      w = rndO(CONFIG.minRoomW, max(parent.width - 2, CONFIG.maxRoomW))
      h = rndO(CONFIG.minRoomH, parent.height - 2)
    } while (h >= w || w > CONFIG.maxRoomW || h > CONFIG.maxRoomH)

    const xSpace = parent.x2 - (parent.x + w)
    const x = rnd(parent.x + 1, parent.x + xSpace)

    const ySpace = parent.y2 - (parent.y + h)
    const y = rnd(parent.y + 1, parent.y + ySpace)

    const roomRect = Rect.at(x, y, w, h)

    const room = new Room(roomRect, i, 1)

    // debug - snap rooms individually
    // current = digRoom(current, room, '.', '#', true)
    // snapshot(current, 'Room', 'bsp')
    return room
  })

  current = digRoom(current, rooms, '.', '#', true)
  snapshot(current, `BSP Rooms Complete (${rooms.length})`, 'bspsuccess')
  return rooms
}

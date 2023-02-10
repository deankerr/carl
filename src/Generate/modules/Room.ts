import { Region } from '../../Core'
import { pick, shuffle } from '../../lib/util'
import { Point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

let rCount = 0
export class Room {
  debugid = rCount++
  adjacentRooms = new Map<Room, Point[]>()
  connected = new Set<Room>()
  constructor(readonly rect: Rect) {}
}

// expand each room rect, store which rooms overlap (ie. door points)
export function findAdjacent(rooms: Room[], region: Region) {
  for (const origin of rooms) {
    const wallRect = origin.rect.scale(1)

    for (const target of rooms) {
      if (origin === target) continue
      const pts = wallRect.intersectPoints(target.rect.scale(1)).filter(pt => {
        let wallCount = 0
        pt.neighbours4().forEach(npt => {
          if (region.terrainAt(npt).blocksMovement) wallCount++
        })
        if (wallCount > 2) return false
        return true
      })

      if (pts.length > 0) {
        origin.adjacentRooms.set(target, pts)
      }
    }
  }
}

export function connectRooms(rooms: Room[], connectCallback: (pt: Point) => unknown) {
  const start = pick(rooms)
  connect(start)

  // recursively connect each room
  function connect(origin: Room) {
    const adjacent = shuffle([...origin.adjacentRooms.keys()])
    while (adjacent.length > 0) {
      const target = adjacent.pop()
      if (!target) return
      if (target.connected.size > 0) continue

      const pts = shuffle([...(origin.adjacentRooms.get(target) ?? [])])
      const pt = pick(pts)

      // check for adj doors here?

      connectCallback(pt)

      origin.connected.add(target)
      target.connected.add(origin)

      connect(target)
    }
  }
}

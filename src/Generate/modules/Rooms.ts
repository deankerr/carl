import { Region } from '../../Core'
import { point, Point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { RegionTheme } from '../Overseer3'

export class Rooms {
  rooms: Room[] = []
  constructor(readonly region: Region, rects: Rect[], regionTheme: RegionTheme) {
    rects.forEach(r => this.rooms.push(new Room(r, regionTheme)))

    // find edges where rooms can connect
    // ? skip if only 1 room
    for (const room of this.rooms) {
      const O3Debug = window.O3Debug // ! dev
      const others = this.rooms.filter(r => r !== room)
      const edgeMap = room.roomEdges

      const searchRect = room.rect.scale(-1)
      const edgePoints = searchRect.edgePoints()
      // north
      const northPts = edgePoints.filter(p => p.y === searchRect.y)
      const eastPts = edgePoints.filter(p => p.x === searchRect.x2)
      const southPts = edgePoints.filter(p => p.y === searchRect.y2)
      const westPts = edgePoints.filter(p => p.x === searchRect.x)

      // travel in the direction of each point until hitting a room or oob
      const search = (pts: Point[], vector: Point) => {
        for (const pt of pts) {
          let n = 1

          while (this.region.inBounds(pt.add(vector.x * n, vector.y * n))) {
            const npt = pt.add(vector.x * n, vector.y * n)
            // ? naively assuming only 1 room can be here
            const [intersects] = others.filter(r => r.rect.pointIntersects(npt))
            if (intersects) {
              // skip points with 3+ walls (corners)
              const terrainAround = npt.neighbours4().map(pt => this.region.terrainAt(pt))
              if (terrainAround.filter(t => t.blocksMovement).length <= 2) {
                const map = edgeMap.get(intersects) ?? []
                map.push(npt)
                edgeMap.set(intersects, map)
              }
              break
            }

            n++
          }
        }
      }
      search(northPts, point(0, -1))
      search(eastPts, point(1, 0))
      search(southPts, point(0, 1))
      search(westPts, point(-1, 0))
      // console.log('room', room.rID, edgeMap)

      // build spanning tree of rooms to connect
    }
  }

  each(callback: RoomCallback) {
    this.rooms.forEach(r => callback(r))
  }
}

type RoomCallback = (room: Room) => unknown

export class Room {
  rID = roomIDs++
  roomEdges = new Map<Room, Point[]>()
  constructor(readonly rect: Rect, public theme: RegionTheme) {}
}

let roomIDs = 0

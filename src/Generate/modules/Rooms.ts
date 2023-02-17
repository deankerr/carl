import { Region } from '../../Core'
import { pick, shuffle } from '../../lib/util'
import { point, Point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { Overseer3, RegionTheme } from '../Overseer3'

export class Rooms {
  roomIDs = 0
  rooms: Room[] = []
  constructor(
    readonly region: Region,
    readonly O3: Overseer3,
    rects: Rect[],
    regionTheme: RegionTheme
  ) {
    rects.forEach(r => this.rooms.push(new Room(r, regionTheme, this.roomIDs++)))

    // ? skip if only 1 room
    if (this.rooms.length <= 1) return

    // find edges where rooms can connect
    for (const room of this.rooms) {
      const O3Debug = window.O3Debug // ! dev
      const others = this.rooms.filter(r => r !== room)
      const edgeMap = room.roomEdges

      // create lists of edge points in each cardinal direction
      const searchRect = room.rect.scale(-1)
      const edgePoints = searchRect.edgePoints()

      const northPts = edgePoints.filter(p => p.y === searchRect.y)
      const eastPts = edgePoints.filter(p => p.x === searchRect.x2)
      const southPts = edgePoints.filter(p => p.y === searchRect.y2)
      const westPts = edgePoints.filter(p => p.x === searchRect.x)

      // travel in the direction of each point until hitting a room or oob
      const search = (pts: Point[], vector: Point) => {
        for (const pt of pts) {
          let n = 1
          const path = []
          while (this.region.inBounds(pt.add(vector.x * n, vector.y * n))) {
            const npt = pt.add(vector.x * n, vector.y * n)
            path.push(npt)
            // ? naively assuming only 1 room can be here
            const [intersects] = others.filter(r => r.rect.pointIntersects(npt))
            if (intersects) {
              // reject path where (last pt) + vector is wall
              const ptNext = npt.add(vector.x * n, vector.y * n)
              if (!('wall' in this.region.terrainAt(ptNext))) {
                const map = edgeMap.get(intersects) ?? []
                map.push(path)
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
    }

    console.groupCollapsed('Edge map')
    this.rooms.forEach(r =>
      console.log(
        'Room',
        r.rID,
        '->',
        [...r.roomEdges.keys()].map(r2 => r2.rID)
      )
    )
    console.groupEnd()

    const start = pick(this.rooms)
    const connected = [start]

    connect(start, pts => {
      pts.forEach(pt => {
        if (this.region.terrainAt(pt).liquid) {
          this.O3.add(pt, 'bridgeFloor')
        } else {
          this.O3.floor(pt)
          this.O3.door(pt)
        }
      })
    })

    function connect(origin: Room, callback: (pt: Point[]) => unknown) {
      const adjacent = shuffle([...origin.roomEdges.keys()])

      while (adjacent.length > 0) {
        const target = adjacent.pop()
        if (!target) {
          console.error('No more adjacent rooms')
          return
        }
        if (connected.includes(target)) continue

        const pts = shuffle([...(origin.roomEdges.get(target) ?? [])])
        const pt = pts[0]

        console.log(`connect ${origin.rID} -> ${target.rID}`)
        callback(pt)

        connected.push(origin, target)
        connect(target, callback)
      }
    }

    console.warn('Success?')
  }

  each(callback: RoomCallback) {
    this.rooms.forEach(r => callback(r))
  }

  debugNumberRooms() {
    this.each(r => this.O3.debugSymbolN(r.rect.centerPoint(), r.rID))
  }
}

type RoomCallback = (room: Room) => unknown

export class Room {
  roomEdges = new Map<Room, Point[][]>()
  constructor(readonly rect: Rect, public theme: RegionTheme, public rID: number) {}
}

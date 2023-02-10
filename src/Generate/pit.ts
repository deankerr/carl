import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { pick, shuffle } from '../lib/util'
import { Point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { FeatureKey } from '../Templates'
import { BSP, Sector } from './modules'
import { CellDish } from './modules/cellular'
import { floodFindRegions } from './modules/flood'
import { Overseer2 } from './Overseer2'

export function pit(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'pit'

  //* cave generation
  const wall = 'pitSolid'
  const floor = 'stoneFloor'

  const drawRoom = (sector: Sector) => {
    sector.rect.scale(1).traverse((pt, edge) => O2.terrain(pt, edge ? wall : floor))
  }

  const bsp = new BSP(region.rect.scale(-1))
  bsp.run(
    6,
    rect => drawRoom(rect),
    i => O2.snapshot('BSP ' + i)
  )

  let rCount = 0
  class Room {
    id = rCount++
    adjacencies = new Map<Room, Point[]>()
    adjacent = new Set<Room>()
    connected = new Set<Room>()
    constructor(readonly rect: Rect) {}
  }
  const rooms: Room[] = []

  bsp.leaves(s => rooms.push(new Room(s.rect)))
  console.log('rooms:', rooms)
  // mark
  rooms.forEach(r => {
    const k = ('debug' + r.id) as FeatureKey
    O2.feature(r.rect.center(), k)
  })

  // find adjacency
  rooms.forEach(origin => {
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
        origin.adjacencies.set(target, pts)
        origin.adjacent.add(target)
      }
    }
  })

  const start = pick(rooms)

  function connectRooms(origin: Room) {
    const adjacent = shuffle([...origin.adjacent])
    while (adjacent.length > 0) {
      const target = adjacent.pop()
      if (!target) return
      if (target.connected.size > 0) continue

      const pts = shuffle([...(origin.adjacencies.get(target) ?? [])])
      const pt = pick(pts)

      // door check here

      O2.terrain(pt, floor)
      O2.feature(pt, pick(['woodenDoor', 'stoneDoor']))
      O2.snapshot('connect')
      origin.connected.add(target)
      target.connected.add(origin)
      console.log('connected', origin.id, target.id)

      connectRooms(target)
    }
  }

  // create doors
  connectRooms(start)

  O2.finalize()
  return region
}

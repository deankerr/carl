import { CONFIG } from '../config'
import { Region } from '../Core'
import { pick } from '../lib/util'
import { Rect } from '../Model/Rectangle'
import { BSP } from './modules'
import { ConstraintSatisfactionProblemSolver } from './modules/CSP'
import { connectRooms, findAdjacent, Room } from './modules/Room'
import { Overseer2 } from './Overseer2'

export function pit(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'pit'
  const wall = 'pitWall'
  const floor = 'dirtFloor'

  const drawRoom = (rect: Rect) => {
    rect.scale(1).traverse((pt, edge) => O2.terrain(pt, edge ? wall : floor))
  }

  const bsp = new BSP(region.rect.scale(-1))
  bsp.run(
    6,
    rect => drawRoom(rect),
    i => O2.snapshot('BSP ' + i)
  )

  // create rooms from BSP leaves
  const rooms: Room[] = []
  bsp.leafRects(rect => rooms.push(new Room(rect)))

  // debug room markers
  // rooms.forEach(r => {
  //   const k = ('debug' + r.debugid) as FeatureKey
  //   O2.feature(r.rect.center(), k)
  // })

  // find adjacent room points
  findAdjacent(rooms, region)

  // create doors
  connectRooms(rooms, pt => {
    O2.terrain(pt, floor)
    O2.feature(pt, pick(['woodenDoor', 'stoneDoor']))
    O2.snapshot('Connect Room')
  })

  // apply CSP
  for (const room of rooms) {
    const csp = new ConstraintSatisfactionProblemSolver(region)
    csp.initializeRect(room.rect.scale(1))

    csp.tryObject('grassTuft', 4)
    csp.tryObject('mushrooms', 4)
    csp.tryObject('webCorner', 3)

    csp.each((pt, cell) => {
      cell.entities.forEach(k => O2.add(pt, k))
    })

    csp.debugLogPointMap()
  }
  // debug

  O2.finalize()
  return region
}
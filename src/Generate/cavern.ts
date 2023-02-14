import { CONFIG } from '../config'
import { FeatureKey, Region } from '../Core'
import { pick } from '../lib/util'
import { Rect } from '../Model/Rectangle'
import { BinarySpacePartition } from './modules'
import { ConstraintSatisfactionProblemSolver } from './modules/CSP'
import { connectRooms, findAdjacent, Room } from './modules/Room'
import { Overseer3 } from './Overseer3'

export function cavern(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height)
  region.name = 'cavern'

  const O3 = new Overseer3(region)
  O3.theme.wall = 'cavernWall'
  O3.theme.floor = 'dirtFloor'

  const drawRoom = (rect: Rect) => {
    O3.room(rect)
  }

  const bsp = new BinarySpacePartition(region.rect.scale(-1))
  bsp.run(
    6,
    rect => drawRoom(rect),
    i => O3.snap('BSP ' + i)
  )

  // create rooms from BSP leaves
  const rooms: Room[] = []
  bsp.leaves(rect => rooms.push(new Room(rect)))

  // debug room markers
  // rooms.forEach(r => {
  //   const k = ('debug' + r.debugid) as FeatureKey
  //   O2.feature(r.rect.center(), k)
  // })

  // find adjacent room points
  findAdjacent(rooms, region)

  // create doors
  connectRooms(rooms, pt => {
    O3.floor(pt)
    O3.door(pt)
    O3.snap('Connect Room')
  })

  // apply CSP
  for (const room of rooms) {
    const csp = new ConstraintSatisfactionProblemSolver(region)
    csp.initializeRect(room.rect.scale(1))
    // csp.solve('smallPitPlatform')
    switch (room.debugid % 6) {
      case 0:
        csp.solve('smallWaterPool')
        break
      case 1:
        csp.solve('smallSlimePool')
        break
      case 2:
        csp.solve('statueCarpetAltar')
        break
      case 3:
        csp.solve('smallAcidPoolPlatform')
        break
      case 4:
        csp.solve('smallCarpetTall')
        break
      case 5:
        csp.solve('smallCarpet')
        break
    }

    csp.solve('grassTuft', 4)
    csp.solve('mushrooms', 4)
    csp.solve('webCorner', 2)
    csp.solve('cornerCandles', 2)
    csp.solve('sconce', 2)

    csp.each((pt, cell) => {
      cell.entities.forEach(k => O3.add(pt, k))
    })
  }

  // first room only
  // const csp = new ConstraintSatisfactionProblemSolver(region)
  // csp.initializeRect(rooms[0].rect.scale(1))
  // csp.solve('smallOilPool')
  // csp.each((pt, cell) => {
  //   cell.entities.forEach(k => O2.add(pt, k))
  // })

  O3.finalize()
  return region
}

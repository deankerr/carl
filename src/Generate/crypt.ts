import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { loop, pick, rnd, shuffle } from '../lib/util'
import { BinarySpacePartition, CSPSolver, CSPVar } from './modules'
import { Overseer3 } from './Overseer3'
import { Rooms } from './modules/Rooms'

export function crypt(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height, 'crypt')

  const O3 = new Overseer3(region)
  O3.theme.wall = 'cryptWall'
  O3.theme.floor = 'stoneTileFloor'
  O3.theme.door = 'woodenDoor'
  O3.room(region.rect, 'Theme')

  // ! dev
  window.O3Debug = O3

  const BSP = new BinarySpacePartition(region.rect)
  if (rnd(1)) {
    BSP.splitLargest('vertical', rnd(3, 7), rnd(1, 2))
    BSP.splitLargest('horizontal', rnd(1, 3), 1)
    BSP.splitLargest('best', 1, 1)
  } else {
    BSP.splitLargest('horizontal', rnd(1, 3), 2)
    BSP.splitLargest('vertical', rnd(3, 5), 1)
    BSP.splitLargest('best', 1, 1)
  }

  const liquidKey = pick(['sludge', 'blood', 'oil', 'slime', 'acid']) as EntityKey
  BSP.rectGaps.forEach(g => O3.add(g.rect, liquidKey, 'river'))

  BSP.splitN(rnd(3, 6))
  const roomRects: Rect[] = []
  BSP.leaves(r => {
    O3.room(r, 'Room')
    roomRects.push(r)
  })

  const rooms = new Rooms(region, O3, roomRects, O3.theme)
  rooms.debugNumberRooms()

  rooms.each(room => {
    if (room.rID > 0) return
    const s = new CSPSolver(region)
    s.initializeRect(room.rect)

    s.solve([
      CSPVar.sconce,
      CSPVar.sconce,
      CSPVar.cornerCandles,
      CSPVar.cornerCandles,
      // CSPVar.smallPitPlatform,
    ])
  })

  O3.finalize()
  return region
}

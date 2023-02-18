import { CONFIG } from '../config'
import { EntityKey, FeatureKey, Region } from '../Core'
import { loop, pick, rnd } from '../lib/util'
import { Rect } from '../lib/Shape/Rectangle'
import { BinarySpacePartition } from './modules'
import { Rooms } from './modules/Rooms'
import { Overseer3 } from './Overseer3'

export function cavern(width = CONFIG.generateWidth * 3, height = CONFIG.generateHeight * 3) {
  const region = new Region(width, height)
  region.name = 'cavern'

  const O3 = new Overseer3(region)
  O3.theme.wall = 'cavernWall'
  O3.theme.floor = 'dirtFloor'

  const drawRoom = (rect: Rect) => {
    O3.room(rect)
  }

  const BSP = new BinarySpacePartition(region.rect)

  const liquidKey = pick(['sludge', 'blood', 'oil', 'slime', 'acid']) as EntityKey
  if (rnd(1)) {
    BSP.splitLargest('vertical', rnd(3, 7), rnd(1, 2))
    BSP.splitLargest('horizontal', rnd(1, 3), 1)
    BSP.splitLargest('best', 1, 1)
  } else {
    BSP.splitLargest('horizontal', rnd(1, 3), 2)
    BSP.splitLargest('vertical', rnd(3, 5), 1)
    BSP.splitLargest('best', 1, 1)
  }
  BSP.rectGaps.forEach(g => O3.add(g.rect, liquidKey, 'river'))

  BSP.splitN(48)
  const roomRects: Rect[] = []
  BSP.leaves(r => {
    O3.room(r, 'Room')
    roomRects.push(r)
  })

  const rooms = new Rooms(region, O3, roomRects, O3.theme)
  rooms.debugNumberRooms()

  O3.finalize()
  return region
}

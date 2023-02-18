import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { pick, rnd } from '../lib/util'
import { BinarySpacePartition } from './modules'
import { Overseer3 } from './Overseer3'

export function dungeon(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height)
  region.name = 'dungeon'
  const O3 = new Overseer3(region)
  O3.theme.floor = 'stoneFloor'

  O3.room(region.rect)
  O3.snap('Initial room')

  const BSP = new BinarySpacePartition(region.rect)

  // split region with rivers
  const riverKey: EntityKey = 'acid'
  const dir = !rnd(1)
  if (dir) {
    BSP.splitLargest('vertical', rnd(1, 9), 2)
    BSP.splitLargest('horizontal', rnd(1, 2), 1)
    BSP.splitLargest('best', 1, 1)
  } else {
    BSP.splitLargest('horizontal', rnd(2), 2)
    BSP.splitLargest('vertical', rnd(3, 7), 1)
    BSP.splitLargest('best', 1, 1)
  }

  BSP.rectGaps.forEach(g => {
    O3.add(g.rect, riverKey)
    O3.snap('river')
  })

  O3.finalize()
  return region
}

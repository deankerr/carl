import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { pick, rnd } from '../lib/util'
import { BinarySpacePartition } from './modules'
import { Overseer3 } from './Overseer3'

export function dungeon(
  isTopLevel: boolean,
  width = CONFIG.generateWidth,
  height = CONFIG.generateHeight
) {
  const region = new Region(width, height)
  region.name = 'dungeon'
  const O3 = new Overseer3(region)
  O3.theme.floor = 'stoneFloor'

  O3.room(region.rect)
  O3.snap('Initial room')

  // const BSP = new BinarySpacePartition(region.rect)

  // // split region with rivers
  // const riverKey: EntityKey = 'water'
  // const dir = !rnd(1)
  // if (dir) {
  //   BSP.splitLargest('vertical', rnd(1, 9), 2)
  //   BSP.splitLargest('horizontal', rnd(1, 2), 1)
  //   BSP.splitLargest('best', 1, 1)
  // } else {
  //   BSP.splitLargest('horizontal', rnd(2), 2)
  //   BSP.splitLargest('vertical', rnd(3, 7), 1)
  //   BSP.splitLargest('best', 1, 1)
  // }

  // BSP.rectGaps.forEach(g => {
  //   O3.add(g.rect, riverKey)
  //   O3.snap('river')
  // })
  const ptC = region.rect.center
  O3.add(ptC.west(), 'water')
  O3.add(ptC.west().south(), 'water')

  O3.add(ptC, 'bookshelf')
  O3.add(ptC.north(), 'bookshelf')

  O3.add(ptC.east(), 'campfire')
  O3.add(ptC.east().south(), 'campfire')

  for (const e of region.get('position')) {
    console.log(e.key, e)
  }

  for (const e of region.at(ptC.west())) {
    if (e.key === 'water') console.log(e.key, e)
  }

  O3.finalize()
  return region
}

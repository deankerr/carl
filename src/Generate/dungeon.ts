import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../Model/Rectangle'
import { pick, rnd } from '../lib/util'
import { BinarySpacePartition } from './modules'
import { Room, findAdjacent, connectRooms } from './modules/Room'
import { Overseer3 } from './Overseer3'

export function dungeon(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height)
  region.name = 'dungeon'
  const O3 = new Overseer3(region)
  O3.theme.floor = 'stoneFloor'

  O3.room(region.rect)
  O3.snap('Initial room')

  // split region with rivers
  const riverKey: EntityKey = 'acid'
  const dir = !rnd(1)
  if (dir) {
    console.log('rivers vertical first')
    O3.BSP.trisectLargest('vertical', rnd(1, 9), 2, rect => {
      O3.add(rect, riverKey, 'Big River Vertical')
    })

    O3.BSP.trisectLargest('horizontal', rnd(1, 2), 1, rect => {
      O3.add(rect, riverKey, 'river horizontal')
    })

    O3.BSP.trisectLargest('largest', 1, 1, rect => {
      O3.add(rect, riverKey, 'river largest')
    })
  } else {
    console.log('rivers horizontal first')
    O3.BSP.trisectLargest('horizontal', rnd(2), 2, rect => {
      O3.add(rect, riverKey, 'big river horizontal')
    })

    O3.BSP.trisectLargest('vertical', rnd(3, 7), 1, rect => {
      O3.add(rect, riverKey, 'river vertical')
    })

    O3.BSP.trisectLargest('largest', 1, 1, rect => {
      O3.add(rect, riverKey, 'river largest')
    })
  }

  const sections = O3.BSP.queue.map(s => new BinarySpacePartition(s.rect))
  for (const section of sections) {
    section.run(
      1,
      rect => {
        O3.room(rect, true)
      },
      i => O3.snap('room ' + i)
    )
    // console.log('section:', section)
  }

  // O3.snap()
  // O3.BSP.bisectRegionRivers('acid', rnd(1, 3), 9, 2, 3, 1)
  // O3.snap()
  // console.log('O3.BSP:', O3.BSP)
  // O3.BSP.all.leaves(rect => O3.floor(rect))

  O3.finalize()
  return region
}

import { CONFIG } from '../config'
import { Region } from '../Core'
import { loop, rnd } from '../lib/util'
import { point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { Overseer3 } from './Overseer3'

// const rScale = 1

// export function dungBSP(
//   width = CONFIG.generateWidth * rScale,
//   height = CONFIG.generateHeight * rScale
// ) {
//   const region = new Region(width, height)
//   region.name = 'dungBSP'
//   const O3 = new Overseer3(region)

//   O3.floor(O3.BSP.initialRect)

//   const BSP2 = new BinarySpacePartition(region.rect)

//   BSP2.splitLargest('vertical', rnd(9), 2)
//   BSP2.rectGaps.forEach(g => O3.add(g.rect, 'sludge'))
//   O3.snap('river')

//   BSP2.splitLargest('horizontal', rnd(3), 1)
//   BSP2.rectGaps.forEach(g => O3.add(g.rect, 'sludge'))
//   O3.snap('river')

//   loop(4, () => {
//     BSP2.splitNext()
//     BSP2.leaves(r => O3.room(r))
//     O3.snap('rooms')
//   })

//   BSP2.leaves(r => O3.room(r, true))
//   O3.snap()

//   O3.finalize()
//   return region
// }

import { CONFIG } from '../config'
import { Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { BinarySpacePartition } from './modules'
import { CSPSolve } from './modules/CSP'
import { Overseer3 } from './Overseer3'

export function dungeon(
  isTopLevel: boolean,
  width = CONFIG.generateWidth,
  height = CONFIG.generateHeight
) {
  const region = new Region(width, height)
  region.name = 'dungeon'
  const O3 = new Overseer3(region)
  O3.theme.floor = 'stoneTileFloor'

  O3.room(region.rect)
  O3.snap('Initial room')

  const BSP = new BinarySpacePartition(region.rect)
  BSP.splitN(6)
  const rooms: Rect[] = []
  BSP.leaves(rect => {
    O3.room(rect)
    rooms.push(rect)
  })

  const csp = new CSPSolve(region, rooms[0])
  // for (const [pt, status] of csp.full) O3.debug(pt, status ? -2 : -1)

  csp.solve(['statueAltar', 'statueAltar', 'mushrooms', 'statue'])
  // csp.solve(['tAltar'])

  O3.finalize()
  return region
}

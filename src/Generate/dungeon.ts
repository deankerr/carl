import { CONFIG } from '../config'
import { Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { BinarySpacePartition, Rooms } from './modules'
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

  const BSP = new BinarySpacePartition(region.rect)
  BSP.splitN(6)
  const rooms: Rect[] = []
  BSP.leaves(rect => {
    O3.room(rect)
    rooms.push(rect)
  })

  const crooms = new Rooms(region, O3, rooms, O3.theme)

  // for (const room of rooms) {
  //   const csp = new Solver(region, room, O3)
  //   csp.solve([
  //     'cornerWebNorthWest',
  //     'cornerWebSouthWest',
  //     'cornerWebSouthEast',
  //     'cornerWebNorthEast',
  //     'smallStonePitPlatformItem',
  //     pick([
  //       'goblinPackWeak',
  //       'goblinPackStrong',
  //       'skeletonPackWeak',
  //       'skeletonPackStrong',
  //       'spiderPack',
  //       'gelCube',
  //       'beholder',
  //     ]),
  //   ])
  // }

  // const csp = new Solver(region, rooms[0])
  // csp.solve([
  //   'cornerWebNorthWest',
  //   'cornerWebSouthWest',
  //   'cornerWebSouthEast',
  //   'cornerWebNorthEast',
  //   'smallPitPlatformItem',
  // ])

  O3.finalize()
  return region
}

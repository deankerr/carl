import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { connectAll } from '../lib/search'
import { Rect } from '../lib/Shape/Rectangle'
import { pick, rnd, shuffle } from '../lib/util'
import { BinarySpacePartition } from './modules'
import { Solver } from './modules/CSP/Solver'
import { Overseer3 } from './Overseer3'

const scale = 1
export function crypt(
  isTopLevel: boolean,
  width = CONFIG.generateWidth * scale,
  height = CONFIG.generateHeight * scale
) {
  const region = new Region(width, height, 'crypt')

  const O3 = new Overseer3(region, 'crypt')
  O3.room(region.rect)

  const BSP = new BinarySpacePartition(region.rect)
  if (rnd(1)) {
    BSP.splitLargest('vertical', rnd(3, 7), rnd(1, 2))
    BSP.splitLargest('horizontal', rnd(1), 1)
    BSP.splitLargest('best', 1, 1)
  } else {
    BSP.splitLargest('horizontal', rnd(1), 2)
    BSP.splitLargest('vertical', rnd(3, 5), 1)
    BSP.splitLargest('best', 1, 1)
  }

  const liquidKey = pick(['sludge', 'lava', 'oil', 'slime', 'acid']) as EntityKey
  BSP.rectGaps.forEach(g => O3.add(g.rect, liquidKey))

  BSP.splitN(rnd(3, 7))
  const rooms: Rect[] = []
  BSP.leaves(r => {
    O3.room(r)
    rooms.push(r)
  })

  const roomFloors = rooms.map(rect => [...rect.scale(-1).each()])
  connectAll(
    region.rect,
    roomFloors,
    () => true,
    pt => {
      const here = region.terrainAt(pt)
      if (here.wall) {
        O3.floor(pt)
        O3.door(pt)
      } else if (here.liquid) O3.add(pt, 'bridgeFloor')
      else O3.floor(pt)
    }
  )
  O3.snap('Rooms connected')

  const [stairsUpRoom, stairsDownRoom] = shuffle(rooms)

  console.groupCollapsed('CSP')
  rooms.forEach((room, i) => {
    const CSP = new Solver(region, room, O3)
    if (room === stairsUpRoom) CSP.solve(['stairsUp']) // todo portals
    if (room === stairsDownRoom) CSP.solve(['stairsDown'])

    CSP.solveOptional(
      [
        pick([
          'smallStonePitPlatformItem',
          'smallSludgePond',
          'smallWaterPond',
          'statueAltar',
          'dirtFloorHoleSquare',
        ]),
      ],
      ['centerX']
    )

    // CSP.solveOptional([
    //   'cryptWallTomb',
    //   'cornerCandle',
    //   'cornerWebNorthEast',
    //   'cornerWebNorthWest',
    //   'cornerWebSouthEast',
    //   'cornerWebSouthWest',
    // ])

    // CSP.fill(['mushroom'], 0.1)

    // CSP.solveOptional([
    //   'sconceTop',
    //   'sconceTop',
    //   pick([
    //     'smallStonePitPlatformItem',
    //     'smallSludgePond',
    //     'smallWaterPond',
    //     'statueAltar',
    //     'dirtFloorHoleSquare',
    //   ]),
    //   'randomItem',
    //   'pots',
    //   'trap',
    //   pick([
    //     'goblinPackWeak',
    //     'goblinPackStrong',
    //     'skeletonPackWeak',
    //     'skeletonPackStrong',
    //     'spiderPack',
    //     'batPack',
    //     'ratPack',
    //     'gelCube',
    //     'beholder',
    //   ]),
    // ])
  })
  console.groupEnd()

  // O3.portal(
  //   rooms.rooms[0].rect.center.west(),
  //   'cryptStairsUp',
  //   isTopLevel ? 'town' : 'here',
  //   isTopLevel ? 0 : 'up'
  // )
  // O3.portal(rooms.rooms[1].rect.center.east(), 'cryptStairsDown', 'here', 'down')
  O3.clearDebug()
  O3.finalize()
  return region
}

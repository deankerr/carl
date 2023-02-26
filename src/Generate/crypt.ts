import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { pick, rnd } from '../lib/util'
import { BinarySpacePartition, Rooms } from './modules'
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
  BSP.rectGaps.forEach(g => O3.add(g.rect, liquidKey))

  BSP.splitN(rnd(4, 7))
  const roomRects: Rect[] = []
  BSP.leaves(r => {
    O3.room(r)
    roomRects.push(r)
  })

  const rooms = new Rooms(region, O3, roomRects, O3.theme)
  // rooms.debugNumberRooms()

  const stairsUpRoom = rnd(rooms.rooms.length - 1)
  let stairsDownRoom = rnd(rooms.rooms.length - 1)
  while (rooms.rooms.length > 1 && stairsUpRoom === stairsDownRoom)
    stairsDownRoom = rnd(rooms.rooms.length - 1)

  console.groupCollapsed('CSP')
  rooms.each(room => {
    const csp = new Solver(region, room.rect, O3)
    if (room.rID === stairsUpRoom) csp.solve(['stairsUp']) // todo portals
    if (room.rID === stairsDownRoom) csp.solve(['stairsDown'])

    csp.solve([
      'cornerWebNorthWest',
      'cornerWebSouthWest',
      'cornerWebSouthEast',
      'cornerWebNorthEast',
      'sconce',
      'sconce',
      // pick(['smallStonePitPlatformItem', 'smallSludgePond', 'smallWaterPond', 'statueAltar']),
      // pick([
      //   'goblinPackWeak',
      //   'goblinPackStrong',
      //   'skeletonPackWeak',
      //   'skeletonPackStrong',
      //   'spiderPack',
      //   'batPack',
      //   'ratPack',
      //   'gelCube',
      //   'beholder',
      // ]),
    ])

    // const itemN = rnd(4)
    // loop(itemN, () => csp.solve(['randomItem']))
  })
  console.groupEnd()

  // O3.portal(
  //   rooms.rooms[0].rect.center.west(),
  //   'cryptStairsUp',
  //   isTopLevel ? 'town' : 'here',
  //   isTopLevel ? 0 : 'up'
  // )
  // O3.portal(rooms.rooms[1].rect.center.east(), 'cryptStairsDown', 'here', 'down')

  O3.finalize()
  return region
}

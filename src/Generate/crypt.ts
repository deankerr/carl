import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { pick, rnd } from '../lib/util'
import { BinarySpacePartition, connectSectors, findSectors } from './modules'
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

  const liquidKey = pick(['sludge', 'blood', 'oil', 'slime', 'acid']) as EntityKey
  BSP.rectGaps.forEach(g => O3.add(g.rect, liquidKey))

  BSP.splitN(rnd(3, 7))
  const roomRects: Rect[] = []
  BSP.leaves(r => {
    O3.room(r)
    roomRects.push(r)
  })

  // const rooms = new Rooms(region, O3, roomRects, O3.theme)
  // rooms.debugNumberRooms()
  const rooms = roomRects
  const sectors = findSectors(region.rect, pt => region.terrainAt(pt).floor == true)
  // const sectorColors = createHues(sectors.length)
  // sectors.forEach((sec, i) => O3.debug([...sec], i, sectorColors[i]))
  // O3.snap('sectors')

  connectSectors(
    region.rect,
    sectors,
    // rooms.map(r => new Set(r.each())),
    pt => region.terrainAt(pt).floor === true,
    pt => {
      const here = region.terrainAt(pt)
      if (here.wall) {
        O3.floor(pt)
        O3.door(pt)
      } else if (here.liquid) O3.add(pt, 'bridgeFloor')
      else O3.floor(pt)
    }
  )
  O3.snap('Caves connected')

  const stairsUpRoom = rnd(rooms.length - 1)
  let stairsDownRoom = rnd(rooms.length - 1)
  while (rooms.length > 1 && stairsUpRoom === stairsDownRoom) stairsDownRoom = rnd(rooms.length - 1)

  console.groupCollapsed('CSP')
  rooms.forEach((room, i) => {
    const CSP = new Solver(region, room, O3)
    if (i === stairsUpRoom) CSP.solve(['stairsUp']) // todo portals
    if (i === stairsDownRoom) CSP.solve(['stairsDown'])

    CSP.solveOptional([
      'cornerCandle',
      'cornerWebNorthEast',
      'cornerWebNorthWest',
      'cornerWebSouthEast',
      'cornerWebSouthWest',
    ])

    CSP.solveOptional([
      'sconceTop',
      'sconceTop',
      pick(['smallStonePitPlatformItem', 'smallSludgePond', 'smallWaterPond', 'statueAltar']),
      'randomItem',
      pick([
        'goblinPackWeak',
        'goblinPackStrong',
        'skeletonPackWeak',
        'skeletonPackStrong',
        'spiderPack',
        'batPack',
        'ratPack',
        'gelCube',
        'beholder',
      ]),
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
  O3.clearDebug()
  O3.finalize()
  return region
}

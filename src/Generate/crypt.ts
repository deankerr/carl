import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../Model/Rectangle'
import { loop, pick, rnd, shuffle } from '../lib/util'
import { BinarySpacePartition } from './modules'
import { Overseer3 } from './Overseer3'
import { ConstraintSatisfactionProblemSolver, CSPObjectKey, cspObjects } from './modules/CSP'
import { Rooms } from './modules/Rooms'

export function crypt(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height, 'crypt')

  const O3 = new Overseer3(region)
  O3.theme.wall = 'cryptWall'
  O3.theme.floor = 'stoneTileFloor'
  O3.room(region.rect, 'Theme')

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
  BSP.rectGaps.forEach(g => O3.add(g.rect, liquidKey, 'river'))

  BSP.splitN(rnd(3, 6))
  const roomRects: Rect[] = []
  BSP.leaves(r => {
    O3.room(r, 'Room')
    roomRects.push(r)
  })

  const rooms = new Rooms(region, roomRects, O3.theme)
  rooms.each(r => O3.debugSymbolN(r.rect.centerPoint(), r.rID))

  rooms.each(r => {
    for (const [room, pts] of r.roomEdges) {
      pts.forEach(pt => O3.debugSymbol(pt, r.rID))
    }
  })
  // O3.debugSymbol(rooms.rooms[0].rect, 4)

  // loop(6, () => {
  //   BSP.splitNext()
  // })
  // BSP.leaves(r => {
  //   O3.room(r, 'Room')
  // })

  // const rooms: Room[] = []
  // subBSP.forEach(sub => sub.leaves(rect => rooms.push(new Room(rect))))

  // const cspMany = [
  //   'grassTuft',
  //   'mushrooms',
  //   'webCorner',
  //   'sconce',
  //   'cornerCandles',
  // ] as CSPObjectKey[]

  // const cspOne: CSPObjectKey[] = shuffle([
  //   'smallPitPlatform',
  //   'smallAcidPool',
  //   'smallAcidPoolPlatform',
  //   'smallBloodPool',
  //   'smallCarpet',
  //   'smallCarpetTall',
  //   'smallOilPool',
  //   'smallWaterPool',
  //   'statueCarpetAltar',
  // ])

  // for (const room of rooms) {
  //   const csp = new ConstraintSatisfactionProblemSolver(region)
  //   csp.initializeRect(room.rect.scale(1))

  //   const one = cspOne.pop()
  //   if (one) csp.solve(one)
  //   const two = cspOne.pop()
  //   if (two) csp.solve(two)

  //   loop(10, () => {
  //     csp.solve(pick(cspMany))
  //   })

  //   csp.each((pt, cell) => {
  //     cell.entities.forEach(k => O3.add(pt, k))
  //   })
  // }

  // console.log('rooms:', rooms)
  O3.finalize()
  return region
}

import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { Rect } from '../Model/Rectangle'
import { loop, pick, rnd, shuffle } from '../lib/util'
import { BSP } from './modules'
import { Room, findAdjacent, connectRooms } from './modules/Room'
import { Overseer3 } from './Overseer3'
import { ConstraintSatisfactionProblemSolver, CSPObjectKey, cspObjects } from './modules/CSP'

export function crypt(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height)
  const O3 = new Overseer3(region, {
    wall: pick(['dungeonWall', 'cryptWall', 'caveWall', 'cavernWall']),
    floor: pick(['stoneFloor', 'dirtFloor', 'stoneTileFloor']),
    door: 'stoneDoor',
  })

  region.name = ''
  const { wall, floor, door } = O3.theme

  const drawRoom = (rect: Rect) => {
    rect.scale(1).traverse((pt, edge) => {
      edge ? O3.wall(pt) : O3.floor(pt)
    })
  }

  const bsp = new BSP(region.rect)
  bsp.trisectLargest('vertical', rnd(1, 11), rnd(1, 2))
  bsp.trisectLargest('horizontal', rnd(1, 2), rnd(1, 2))
  bsp.trisectLargest('largest', 1, 1)

  // bsp.leaves(rect => drawRoom(rect))
  const subBSP: BSP[] = []
  bsp.leaves(rect => subBSP.push(new BSP(rect.scale(-1))))

  subBSP.forEach(sub => sub.leaves(rect => drawRoom(rect)))
  O3.snap()

  const liquidKey = pick(['sludge', 'water', 'blood', 'oil', 'slime', 'acid']) as EntityKey
  bsp.remainders(rect => O3.add(rect, liquidKey))
  O3.snap()

  subBSP.forEach((sub, i) =>
    sub.run(
      rnd(i),
      rect => drawRoom(rect),
      i => O3.snap()
    )
  )

  const rooms: Room[] = []
  subBSP.forEach(sub => sub.leaves(rect => rooms.push(new Room(rect))))

  const cspMany = [
    'grassTuft',
    'mushrooms',
    'webCorner',
    'sconce',
    'cornerCandles',
  ] as CSPObjectKey[]

  const cspOne: CSPObjectKey[] = shuffle([
    'smallPitPlatform',
    'smallAcidPool',
    'smallAcidPoolPlatform',
    'smallBloodPool',
    'smallCarpet',
    'smallCarpetTall',
    'smallOilPool',
    'smallWaterPool',
    'statueCarpetAltar',
  ])

  for (const room of rooms) {
    const csp = new ConstraintSatisfactionProblemSolver(region)
    csp.initializeRect(room.rect.scale(1))

    const one = cspOne.pop()
    if (one) csp.solve(one)
    const two = cspOne.pop()
    if (two) csp.solve(two)

    loop(10, () => {
      csp.solve(pick(cspMany))
    })

    csp.each((pt, cell) => {
      cell.entities.forEach(k => O3.add(pt, k))
    })
  }

  // console.log('rooms:', rooms)
  O3.finalize()
  return region
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from '../config'
import { Region } from '../Core'
import { floor, loop, pick, repeat, rnd, shuffle } from '../lib/util'
import { Point, point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { flameKeys, flameVariants } from '../Templates/flames'
import { CellDish } from './modules/cellular'
import { rndCluster, floodWalkable } from './modules/flood'
import { hop } from './modules/walk'
import { Overseer2 } from './Overseer2'

export function cave(
  // width = floor(CONFIG.mainDisplayWidth * 1.5),
  // height = floor(CONFIG.mainDisplayHeight * 1.5)
  width = CONFIG.mainDisplayWidth,
  height = CONFIG.mainDisplayHeight
) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'cave'
  region.palette.ground = '#251316'
  region.palette.unknown = '#1d191f'
  region.palette.solid = '#342f37'

  const rect = region.rect

  // cellular automata cave generation
  const wall = 'caveSolid'
  const floor = 'dirtFloor'
  const water = 'water'

  const dish = new CellDish(region.rect)
  dish.addAlways(region.rect.edgePoints())
  dish.randomize(45).alive(pt => O2.terrain(pt, 'caveSolid'))
  O2.snapshot('cell init')

  dish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 1')

  dish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 2')

  dish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 3')

  dish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 4')

  dish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 5')

  // lake
  const lakeSeed = rndCluster(5, O2.module())
  const lakeSeed2 = rndCluster(5, O2.module())

  const lakeDish = new CellDish(region.rect)

  region.rect.traverse(pt => {
    if (region.terrainAt(pt).blocksMovement) lakeDish.neverCells.add(pt)
  })
  lakeDish.addAlways([...lakeSeed, ...lakeSeed2]).alive(pt => O2.terrain(pt, water))
  O2.snapshot('lake seed')

  // grow
  lakeDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 1')

  lakeDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 2')

  lakeDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 3')

  // cell gen
  lakeDish.cull(30)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('cull')

  lakeDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 4')
  lakeDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 5')
  lakeDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 6')
  // lakeDish.generation(0, 0)
  // lakeDish.generation(0, 0)
  // lakeDish.alive(pt => O2.terrain(pt, 'water'))
  // O2.snapshot('lake cell 1')

  // lakeDish.generation(0, 0)
  // lakeDish.alive(pt => O2.terrain(pt, 'water'))
  // O2.snapshot('lake cell 2')

  // lakeDish.generation(0, 0)
  // lakeDish.alive(pt => O2.terrain(pt, 'water'))
  // O2.snapshot('lake cell 3')

  // lakeDish.generation(0, 0)
  // lakeDish.alive(pt => O2.terrain(pt, 'water'))
  // O2.snapshot('lake cell 4')

  // lakeDish.cull(20)
  // lakeDish.changes((pt, status) => O2.terrain(pt, status ? 'water' : 'dirtFloor'))
  // // lakeDish.changes((pt, status) => O2.terrain(pt, status ? 'water' : 'dirtFloor'))
  // O2.snapshot('tamper')
  // // lakeDish.debug()

  // lakeDish.generation(4, 5)
  // // lakeDish.changes((pt, status) => O2.terrain(pt, status ? 'water' : 'dirtFloor'))
  // O2.snapshot('lake cell 5')

  // lakeDish.generation(4, 5)
  // // lakeDish.changes((pt, status) => O2.terrain(pt, status ? 'water' : 'dirtFloor'))
  // O2.snapshot('lake cell 6')

  // lakeDish.generation(4, 5)
  // lakeDish.changes((pt, status) => O2.terrain(pt, status ? 'water' : 'dirtFloor'))
  // O2.snapshot('lake cell 7')
  // lakeDish.debug()

  // lakeDish.generation(4, 5)
  // lakeDish.alive(pt => O2.terrain(pt, 'water'))
  // O2.snapshot('lake cell 6')

  // lakeDish.generation(4, 5)
  // lakeDish.alive(pt => O2.terrain(pt, 'water'))
  // O2.snapshot('lake cell 7')
  // lakeDish.always

  // const { being, feature, terrain, snap } = O2.module()

  // const seed1 = flood(region.rndWalkable(), 11, O2.module(), 'water')
  // const seed2 = flood(region.rndWalkable(), 9, O2.module(), 'water')
  // const seed3 = flood(region.rndWalkable(), 9, O2.module(), 'water')
  // const seed4 = flood(region.rndWalkable(), 11, O2.module(), 'water')
  // lake(new Set([...seed1, ...seed2, ...seed3, ...seed4]), O2.module(), 'water')

  // const seed1 = flood(region.rndWalkable(), 12, O2.module(), 'water')
  // const seed2 = flood(region.rndWalkable(), 12, O2.module(), 'water')
  // lake(new Set([...seed1, ...seed2]), O2.module(), 'water', 'dirtFloor')

  // Rect.at(point(0, 0), region.width, region.height).traverse(pt => {
  //   if (region.terrainAt(pt).label === 'water') {
  //     const above = region.terrainAt(pt.add(0, -1))
  //     if (above.label !== 'water' && !above.face) O2.terrain(pt, 'waterFace')
  //   }
  // })
  // O2.snapshot('decorate')
  // O2.terrain(rect.center(), 'cactus')
  // const snapC = snap('Friendly critters')

  // hop(2, 4, 3, region.rndWalkable.bind(region), being('snake'))

  // loop(2, () => {
  //   rndCluster(4, O2.module()).forEach(pt => O2.being(pt, 'snake'))
  // })

  // loop(2, () => {
  //   rndCluster(4, O2.module()).forEach(pt => O2.being(pt, 'spider'))
  // })

  // loop(2, () => {
  //   rndCluster(4, O2.module()).forEach(pt => O2.being(pt, 'scorpion'))
  // })

  // loop(2, () => {
  //   rndCluster(4, O2.module()).forEach((pt, i) => {
  //     if (i === 0) O2.being(pt, 'bigMozzie')
  //     else O2.being(pt, 'mozzie')
  //   })
  // })

  // const webArea = flood(region.rndWalkable(), 12, O2.module(), 'web', ['water'])
  // const webArea2 = flood(region.rndWalkable(), 12, O2.module(), 'web', ['water'])
  // lake(new Set([...webArea, ...webArea2]), O2.module(), 'web')

  // const pWebArea = shuffle([...webArea])
  // loop(6, i => {
  //   const pt = pWebArea.pop()
  //   if (pt && i === 0) O2.feature(pt, 'greenFlames')
  //   else if (pt) O2.being(pt, 'spider')
  // })
  // snapC()

  // const pWebArea2 = shuffle([...webArea2])
  // loop(5, () => {
  //   const pt = pWebArea2.pop()
  //   if (pt) O2.being(pt, 'spider')
  // })
  // snapC()

  // const scorpF = flood(region.rndWalkable(), 12, O2.module(), 'sand', ['water', 'web'])
  // lake(scorpF, O2.module(), 'sand')
  // const sandArea = shuffle([...scorpF])
  // loop(9, () => {
  //   const pt = sandArea.pop()
  //   if (pt) O2.feature(pt, 'cactus')
  // })
  // loop(7, () => {
  //   const pt = sandArea.pop()
  //   if (pt) O2.being(pt, 'scorpion')
  // })
  // loop(2, () => {
  //   const pt = sandArea.pop()
  //   if (pt) O2.feature(pt, 'flames')
  // })
  // snapC()

  // hop(2, 4, 3, region.rndWalkable.bind(region), being('bigMozzie'))
  // hop(4, 5, 4, region.rndWalkable.bind(region), being('mozzie'))
  // snapC()

  // const snapF = snap('Start fires')
  // repeat(1, () => {
  //   flameKeys.forEach(k => feature(k)(region.rndWalkable()))
  //   snapF()
  // })
  // feature('flames')(rect.center())

  O2.finalize()
  return region
}

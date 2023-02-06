/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from '../config'
import { Region } from '../Core'
import { floor, loop, pick, repeat, shuffle } from '../lib/util'
import { Point, point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { flameKeys, flameVariants } from '../Templates/flames'
import { cellularGrid } from './modules/cellular'
import { rndCluster, lake, flood, floodWalkable } from './modules/flood'
import { hop } from './modules/walk'
import { Overseer2 } from './Overseer2'

export function cave(
  width = floor(CONFIG.mainDisplayWidth * 1.5),
  height = floor(CONFIG.mainDisplayHeight * 1.5)
) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'cave'
  region.palette.ground = '#251316'
  region.palette.unknown = '#1d191f'
  region.palette.solid = '#342f37'

  const rect = Rect.at(point(0, 0), width, height)

  // cellular automata cave generation
  const grid = cellularGrid(width, height, 5, O2.module())

  const { being, feature, terrain, snap } = O2.module()

  const seed1 = flood(region.rndWalkable(), 11, O2.module(), 'water')
  const seed2 = flood(region.rndWalkable(), 9, O2.module(), 'water')
  const seed3 = flood(region.rndWalkable(), 9, O2.module(), 'water')
  const seed4 = flood(region.rndWalkable(), 11, O2.module(), 'water')

  lake(new Set([...seed1, ...seed2, ...seed3, ...seed4]), O2.module(), 'water')

  rect.traverse(pt => {
    if (region.terrainAt(pt).blocksMovement) {
      if (region.terrainAt(pt.add(0, 1)).blocksMovement) O2.terrain(pt, 'solid')
      else O2.terrain(pt, 'brick')
    }
  })
  O2.snapshot('Style!')

  // O2.terrain(rect.center(), 'cactus')
  const snapC = snap('Friendly critters')

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

  const webArea = flood(region.rndWalkable(), 12, O2.module(), 'web', 'water')
  const webArea2 = flood(region.rndWalkable(), 12, O2.module(), 'web', 'water')
  lake(new Set([...webArea, ...webArea2]), O2.module(), 'web')

  const pWebArea = shuffle([...webArea])
  loop(5, () => {
    const pt = pWebArea.pop()
    if (pt) O2.being(pt, 'spider')
  })
  snapC()

  const pWebArea2 = shuffle([...webArea2])
  loop(5, () => {
    const pt = pWebArea2.pop()
    if (pt) O2.being(pt, 'spider')
  })
  snapC()
  // rndCluster(4, O2.module()).forEach(pt => O2.terrain(pt, 'web'))

  // hop(2, 4, 3, region.rndWalkable.bind(region), being('spider'))
  // snapC()
  // hop(2, 4, 3, region.rndWalkable.bind(region), being('warboy'))
  // snapC()
  // hop(2, 4, 3, region.rndWalkable.bind(region), being('scorpion'))
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
  feature('cactus')(region.rndWalkable())
  O2.snapshot('one cactus')

  O2.finalize()
  return region
}

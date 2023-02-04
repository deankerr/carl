/* eslint-disable @typescript-eslint/no-unused-vars */
import { Region } from '../Core'
import { loop, pick, repeat } from '../lib/util'
import { Point, point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { flameKeys, flameVariants } from '../Templates/flames'
import { cellularGrid } from './modules/cellular'
import { hop } from './modules/drunkards'
import { Overseer2 } from './Overseer2'
// width = CONFIG.mainDisplayWidth * 2, height = CONFIG.mainDisplayHeight * 2
export function cave(width = 79, height = 49) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'cave'
  region.voidColor = '#251316'

  // cellular automata cave generation
  const grid = cellularGrid(width, height, 5, O2.module())

  const rect = Rect.at(point(0, 0), width, height)
  rect.traverse(pt => {
    if (region.terrainAt(pt).blocksMovement) {
      if (region.terrainAt(pt.add(0, 1)).blocksMovement) O2.terrain(pt, 'solidGreyPurple')
      else O2.terrain(pt, 'wall2')
    }
  })
  O2.snapshot('Style!')

  const { being, feature, snap } = O2.module()

  hop(8, 4, 4, region.rndWalkable.bind(region), being('snake'), snap('snakes'))
  hop(8, 4, 4, region.rndWalkable.bind(region), being('bloodGull'), snap('gulls'))
  hop(8, 4, 4, region.rndWalkable.bind(region), being('spider'), snap('spiders'))
  hop(8, 4, 4, region.rndWalkable.bind(region), being('warboy'), snap('warboys'))
  hop(8, 4, 4, region.rndWalkable.bind(region), being('scorpion'), snap('scorpions'))

  repeat(10, () => {
    feature(pick(flameKeys))(region.rndWalkable())
    feature('cactus')(region.rndWalkable())
  })
  snap('fire')

  feature('shrub')
  O2.finalize()
  return region
}

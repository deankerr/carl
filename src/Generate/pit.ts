import { CONFIG } from '../config'
import { Region } from '../Core'
import { Point } from '../Model/Point'
import { BSP } from './modules'
import { CellDish } from './modules/cellular'
import { floodFindRegions } from './modules/flood'
import { Overseer2 } from './Overseer2'

export function pit(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'pit'

  //* cave generation
  const wall = 'pitSolid'
  const floor = 'stoneFloor'

  // const caveDish = new CellDish(region.rect)
  // caveDish.addAlways(region.rect.edgePoints())
  // caveDish.randomize(40)
  // caveDish.generation(4, 5)
  // caveDish.generation(4, 5)
  // caveDish.generation(4, 5)
  // caveDish.generation(4, 5)
  // caveDish.generation(4, 5)
  // caveDish.current((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  // floodFindRegions(region.rect, (pt: Point) => !region.terrainAt(pt).blocksMovement)
  const { snap } = O2.module()
  const b = snap('bsp')
  const bsp = new BSP(region.rect.scale(-1))
  bsp.go()
  b()
  bsp.go()
  b()
  bsp.go()
  b()
  bsp.go()
  bsp.queue.forEach(s => s.rect.traverse(pt => O2.terrain(pt, floor)))
  b()

  O2.snapshot('deed')
  O2.finalize()
  return region
}

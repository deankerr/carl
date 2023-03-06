import { CONFIG } from '../config'
import { Region } from '../Core'
import { point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'
import { CellDish } from './modules'
import { Solver } from './modules/CSP/Solver'
import { Overseer3 } from './Overseer3'

export function town(
  isTopLevel: boolean,
  width = CONFIG.generateWidth,
  height = CONFIG.generateHeight
) {
  const region = new Region(width, height, 'Town', 'bright')
  region.recallAll = true

  const O3 = new Overseer3(region, 'cave')
  O3.theme.floor = 'grassFloor'

  const dish = new CellDish(region.rect)
  dish.addAlways(region.rect.edgePoints())
  dish.randomize(40).current((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell init')
  dish.generation(4, 5)((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell 1')
  dish.generation(4, 5)((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell 2')
  dish.generation(4, 5)((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell 3')

  O3.floor(region.rect)
  O3.snap('grass')

  const riverRect = Rect.atC(point(region.rect.cx, height - 4), width, 3)
  O3.clear(riverRect)
  O3.add(riverRect, 'water')
  O3.snap('river')

  const CSP = new Solver(region, region.rect, O3)

  CSP.solve(['house', 'house', 'house', 'house'])

  O3.finalize()
  return region
}

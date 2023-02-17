import { CONFIG } from '../config'
import { Region } from '../Core'
import { rnd } from '../lib/util'
import { point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { BinarySpacePartition, CellDish } from './modules'
import { Overseer3 } from './Overseer3'

export function townDemo(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height, 'crypt')
  const O3 = new Overseer3(region)
  O3.theme.wall = 'cryptWall'
  O3.theme.floor = 'grassFloor'
  O3.theme.door = 'woodenDoor'

  const dish = new CellDish(region.rect)
  dish.addAlways(region.rect.edgePoints())
  dish.randomize(40).current((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell init')

  dish.generation(5, 5)((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell 1')

  dish.generation(4, 5)((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell 2')

  dish.generation(4, 5)((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell 3')

  dish.generation(4, 5)((pt, alive) => (alive ? O3.add(pt, 'shrub') : O3.clear(pt)))
  O3.snap('cell 4')

  O3.floor(region.rect)
  O3.snap('grass')

  const riverRect = Rect.atC(point(region.rect.cx, height - 4), width, 3)
  O3.clear(riverRect)
  O3.add(riverRect, 'water')
  O3.snap('river')

  const bridgeRect = Rect.atC(riverRect.center.east(4), 2, 3)
  O3.clear(bridgeRect.scale(1, 1))

  O3.add(bridgeRect, 'bridgeFloor')

  const cPt = region.rect.center
  const bPt1 = cPt.add(-2, 0)
  O3.building(bPt1)

  const bPt2 = cPt.add(-12, -5)
  const bPt3 = cPt.add(14, -5)
  O3.building(bPt2, 'potion')
  O3.building(bPt3, 'weapon')

  for (let xi = bPt2.x - 1; xi <= bPt3.x + 1; xi++) {
    O3.add(point(xi, bPt2.y + 1), 'grassPath')
  }

  O3.building(cPt.add(9, 1), 'inn')

  const cfPt = cPt.add(-12, 0)
  O3.add(cfPt, 'campfire')
  O3.add(cfPt.west(2), 'horse')

  O3.finalize()
  return region
}

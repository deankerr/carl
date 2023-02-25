import { CONFIG } from '../config'
import { Region } from '../Core'
import { point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'
import { CellDish } from './modules'
import { Overseer3 } from './Overseer3'

export function townDemo(
  isTopLevel: boolean,
  width = CONFIG.generateWidth,
  height = CONFIG.generateHeight
) {
  const region = new Region(width, height, 'Town Prefab', 'bright')
  region.recallAll = true

  const O3 = new Overseer3(region)
  O3.theme.wall = 'cryptWall'
  O3.theme.floor = 'grassFloor'
  O3.theme.door = 'woodenDoor'

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

  const bridgeRect = Rect.atC(riverRect.center.east(4), 2, 3)
  O3.clear(bridgeRect.scale(1, 1))
  O3.add(bridgeRect, 'bridgeFloor')
  O3.add(bridgeRect.scale(0, -1).translate(0, -1), 'shadow')

  const cPt = region.rect.center
  const bPt1 = cPt.add(-2, 0) // hut
  O3.building(bPt1)

  const bPt2 = cPt.add(-12, -5) // potion
  O3.building(bPt2, 'potion')

  const bPt3 = cPt.add(14, -5) // weapon
  O3.building(bPt3, 'weapon')

  const bPt4 = cPt.add(9, 1) // inn
  O3.building(bPt4, 'inn')

  // paths
  const passFn = (x: number, y: number) => {
    const pt = point(x, y)
    const here = region.at(pt)
    return here.some(e => e.key === 'shrub') || !here.some(e => e.blocksMovement)
  }
  O3.path(bPt2.south(), bPt1.south(), 'grassPath', passFn)
  O3.path(bPt1.south(), bPt3.south(), 'grassPath', passFn)
  O3.path(bPt1.south(), bPt4.south(), 'grassPath', passFn)

  const dPt = cPt.add(2, -6)
  const dRect = Rect.atC(dPt, 5, 3)
  O3.clear(dRect)
  O3.snap('dirt 1')
  const ddish = new CellDish(dRect.scale(1).translate(0, 1))
  ddish.edge = false
  ddish.addAlways(dRect.toPts())
  ddish.randomize(40).current((pt, alive) => O3.add(pt, alive ? 'dirtFloorOutdoor' : 'grassFloor'))
  O3.snap('dirt 2')

  ddish.generation(
    4,
    5
  )((pt, alive) => {
    O3.add(pt, alive ? 'dirtFloorOutdoor' : 'grassFloor')
  })
  ddish.alive(pt => O3.clear(pt))
  O3.snap('dirt 3')

  // O3.add(dRect, 'dirtFloorDetailed')
  // O3.path(dRect.p1, dRect.p1.east(4), 'dirtLedge')

  O3.add(dRect.p1, 'dirtBoulder')
  O3.add(dRect.p1.south(1), 'dirtBoulder')
  O3.add(dRect.p1.east(4), 'stoneBoulder')

  O3.add(dRect.p2.north(1), 'bones')
  O3.add(dRect.p2.west(1), 'bones')

  O3.portal(dPt, 'cryptStairsDown', 'crypt', 0)

  O3.add(bPt1.add(-1, 1), 'catTan')
  O3.add(bPt1.add(2, 1), 'thief')

  const wellPt = bPt1.east(5)
  O3.clear(Rect.atC(wellPt, 3, 3))
  O3.add(wellPt, 'cavePool')

  O3.add(bPt2.add(-1, 1), 'guy')

  O3.add(bPt3.add(0, 1), 'girl')

  O3.add(bPt4.add(-1, 1), 'sorceress')
  O3.add(bPt4.add(1, 1), 'dog')

  const cfPt = cPt.add(-12, 0)
  O3.add(cfPt, 'campfire')
  O3.add(cfPt.west(2), 'horse')
  O3.add(cfPt.east(2), 'archer')

  O3.add(bridgeRect.p2, 'player')
  O3.finalize()
  return region
}

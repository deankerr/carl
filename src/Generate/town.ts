import { CONFIG } from '../config'
import { Region } from '../Core'
import { connectAll, select } from '../lib/search'
import { Point, point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'
import { cellularAutomata } from './modules'
import { solve } from './modules/CSP/solve'
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

  const cells = cellularAutomata(region.rect, {
    initialChance: 35,
    survival: 4,
    birth: 5,
    iterations: 5,
  })

  cells.forEach((grid, i) => {
    for (const [pt, state] of grid) {
      if (region.rect.isEdgePt(pt)) O3.add(pt, 'shrub')
      else state ? O3.add(pt, 'shrub') : O3.clear(pt)
    }
    O3.snap('Cellular Automata - ' + i)
  })

  O3.floor(region.rect)

  const riverRect = Rect.atC(point(region.rect.cx, height - 4), width, 3)
  O3.clear(riverRect)
  O3.add(riverRect, 'water')

  const bridge = Rect.atC(riverRect.center, 2, 3)
  O3.add(bridge, 'bridgeFloor')
  O3.snap('river')

  solve(
    {
      region,
      domain: region.rect,
      variables: [
        'caveEntrance',
        'campParty',
        'weaponShop',
        'potionShop',
        'inn',
        'house',
        'house',
        // 'house',
        'well',
      ],
      optional: false,
    },
    O3
  )

  const townPaths = select(region.rect, pt => region.terrainAt(pt).key === 'grassPath')

  const pathThrough = (pt: Point) => {
    const terrainKey = region.terrainAt(pt).key
    return terrainKey === 'grassPath' || terrainKey === 'grassFloor'
  }

  connectAll(region.rect, townPaths, pathThrough, pt => {
    O3.add(pt, 'grassPath')
    O3.snap('path', 'fast')
  })

  O3.finalize()
  return region
}

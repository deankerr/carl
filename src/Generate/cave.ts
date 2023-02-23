import { CONFIG } from '../config'
import { Region } from '../Core'
import { createHues } from '../lib/color'
import { range } from '../lib/util'
import { connectSectors, findSectors } from './modules'
import { CellDish } from './modules/cellular'
import { Overseer3 } from './Overseer3'

const mapScale = 2

export function cave(
  isTopLevel: boolean,
  width = CONFIG.generateWidth * mapScale,
  height = CONFIG.generateHeight * mapScale
) {
  const region = new Region(width, height, 'cave')
  const O3 = new Overseer3(region)
  O3.theme.wall = 'caveWall'
  O3.theme.floor = 'dirtFloor'

  O3.floor(region.rect, 'begin')

  // * cave generation
  const caveDish = new CellDish(region.rect)
  caveDish.addAlways(region.rect.edgePoints())
  caveDish.randomize(49).current((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  O3.snap()
  for (const _ of range(4)) {
    caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
    O3.snap()
  }

  const sectors = findSectors(region.rect, pt => !region.terrainAt(pt).blocksMovement)
  const secColors = createHues(sectors.length)
  sectors.forEach((sec, i) => O3.debug([...sec], i, secColors[i]))
  O3.snap()

  connectSectors(
    region.rect,
    sectors,
    pt => !region.terrainAt(pt).blocksMovement,
    pt => O3.floor(pt)
  )

  O3.snap('Caves connected')

  O3.clearDebug()
  O3.finalize()
  return region
}

import { CONFIG } from '../config'
import { Region } from '../Core'
import { createHues } from '../lib/color'
import { findSectors } from './modules'
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

  // * cave generation
  const caveDish = new CellDish(region.rect)
  caveDish.addAlways(region.rect.edgePoints())
  caveDish.randomize(45).current((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))

  const sectors = findSectors(region.rect, pt => !region.terrainAt(pt).blocksMovement)

  const colors = createHues(sectors.length)
  sectors.forEach((sec, i) => {
    console.log(`Sector ${i}: size ${sec.size}, pc ${(sec.size / region.rect.area) * 100}`)
    for (const pt of sec) {
      O3.debug(pt, i, colors[i])
    }
  })

  O3.finalize()
  return region
}

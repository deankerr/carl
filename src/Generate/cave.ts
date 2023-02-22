import { CONFIG } from '../config'
import { Region } from '../Core'
import { createHues } from '../lib/color'
import { ltimer } from '../lib/util'
import { findPathToClosest, findSectors } from './modules'
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
  caveDish.randomize(51).current((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))

  const sectors = findSectors(region.rect, pt => !region.terrainAt(pt).blocksMovement).sort(
    (a, b) => a.size - b.size
  )

  const colors = createHues(sectors.length)
  sectors.forEach((sec, i) => {
    console.log(`Sector ${i}: size ${sec.size}, pc ${(sec.size / region.rect.area) * 100}`)
    for (const pt of sec) {
      O3.debug(pt, i, colors[i])
    }
  })
  O3.snap()

  const stimer = ltimer('connect sectors')
  let count = 0
  for (const sector of sectors) {
    if (count++ >= sectors.length - 1) break
    const sstimer = ltimer('connect')
    const [pt, path] = findPathToClosest(
      region.rect,
      sector,
      pt => !region.terrainAt(pt).blocksMovement
    )

    const owner = sectors.find(s => s.has(pt))
    const ownerI = sectors.findIndex(s => s === owner)
    if (!owner || ownerI < 0) throw new Error('Who owns this?')
    for (const pt of path) {
      O3.floor(pt)
      owner.add(pt)
    }

    for (const pt of sector) owner.add(pt)
    sector.clear()
    O3.snap() > sstimer.stop()
  }
  stimer.stop()

  console.log('sectors:', sectors)
  O3.finalize()
  return region
}

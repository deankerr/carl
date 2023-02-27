import { CONFIG } from '../config'
import { Region } from '../Core'
import { createHues } from '../lib/color'
import { logTimer, range } from '../lib/util'
import { connectSectors, findSectors } from './modules'
import { CellDish } from './modules/cellular'
import { Solver } from './modules/CSP/Solver'
import { Overseer3 } from './Overseer3'

const mapScale = 2

export function cave(
  isTopLevel: boolean,
  width = CONFIG.generateWidth * mapScale,
  height = CONFIG.generateHeight * mapScale
) {
  const region = new Region(width, height, 'caverns of carl')
  const O3 = new Overseer3(region)
  O3.theme.wall = 'caveWall'
  O3.theme.floor = 'dirtFloor'

  O3.floor(region.rect)

  // * cave generation
  const tCell = logTimer('cave gen')
  const caveDish = new CellDish(region.rect)
  caveDish.addAlways(region.rect.edgePoints())
  caveDish
    .randomize(45 + 2 * (mapScale - 1))
    .current((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
  O3.snap()
  for (const _ of range(5)) {
    caveDish.generation(4, 5)((pt, alive) => (alive ? O3.wall(pt) : O3.floor(pt)))
    // O3.snap()
  }
  tCell.stop()

  // * connect caves
  const sectors = findSectors(region.rect, pt => !region.terrainAt(pt).blocksMovement)
  const secColors = createHues(sectors.length)
  sectors.forEach((sec, i) => O3.debug([...sec], i, secColors[i]))
  // O3.snap()

  connectSectors(
    region.rect,
    sectors,
    pt => !region.terrainAt(pt).blocksMovement,
    pt => O3.floor(pt)
  )
  // O3.snap('Caves connected')

  // * remove inner walls
  const inner = findSectors(region.rect, pt => {
    if (region.terrainAt(pt).blocksMovement) {
      const walls = pt
        .neighbours()
        .map(npt => region.terrainAt(npt))
        .filter(n => n.wall || n.outOfBounds)
      return walls.length === 8
    } else return false
  })
  inner.forEach(wal => O3.add([...wal], 'abyss'))
  // O3.snap('remove inner')
  O3.clearDebug()

  // console.log('sectors:', sectors)
  const CSP = new Solver(region, region.rect, O3)
  CSP.fill(
    ['cornerWebNorthEast', 'cornerWebNorthWest', 'cornerWebSouthEast', 'cornerWebSouthWest'],
    0.1
  )

  CSP.fill(['mushroom'], 0.01)
  CSP.fill(['dirtBoulder'], 0.01)
  CSP.fill(['stoneBoulder'], 0.01)
  CSP.fill(['sconceOpen'], 0.1)

  CSP.solve([
    'batPack',
    'beholder',
    // 'bigDesk',
    'gelCube',
    'goblinPackStrong',
    'ratPack',
    // 'smallDirtPitPlatformItem',
  ])

  O3.clearDebug()
  O3.finalize()
  return region
}

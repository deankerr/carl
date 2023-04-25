import { CONFIG } from '../config'
import { Region } from '../Core'
import { connectAll, select } from '../lib/search'
import { cellularAutomata } from './modules/cellular'
import { fill, solve } from './modules/CSP/solve'
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
  const cells = cellularAutomata(region.rect, {
    initialChance: 45 + 2 * (mapScale - 1),
    survival: 4,
    birth: 5,
    iterations: 5,
  })

  cells.forEach((grid, i) => {
    for (const [pt, state] of grid) {
      if (region.rect.isEdgePt(pt)) O3.wall(pt)
      else state ? O3.wall(pt) : O3.floor(pt)
    }
    O3.snap('Cellular Automata - ' + i)
  })

  // * connect caves
  const open = select(region.rect, pt => !region.terrainAt(pt).blocksMovement)
  connectAll(
    region.rect,
    open,
    () => true,
    pt => O3.floor(pt)
  )
  O3.snap('Caves connected')

  // * remove hidden walls
  const hiddenWalls = select(region.rect, pt => {
    if (region.terrainAt(pt).blocksMovement) {
      const walls = pt
        .neighbours()
        .map(npt => region.terrainAt(npt))
        .filter(n => n.wall || n.outOfBounds)
      return walls.length === 8
    } else return false
  })
  hiddenWalls.forEach(wall => O3.add([...wall], 'abyss'))

  // const CSP = new Solver(region, region.rect, O3)
  // CSP.fill(
  //   ['cornerWebNorthEast', 'cornerWebNorthWest', 'cornerWebSouthEast', 'cornerWebSouthWest'],
  //   0.1
  // )

  // CSP.fill(['mushroom'], 0.01)
  // CSP.fill(['dirtBoulder'], 0.01)
  // CSP.fill(['stoneBoulder'], 0.01)
  // CSP.fill(['sconceOpen'], 0.1)

  // CSP.solve([
  //   'batPack',
  //   'beholder',
  //   // 'bigDesk',
  //   'gelCube',
  //   'goblinPackStrong',
  //   'ratPack',
  //   // 'smallDirtPitPlatformItem',
  // ])

  fill(
    {
      region,
      domain: region.rect,
      variables: [
        'cornerWebNorthEast',
        'cornerWebNorthWest',
        'cornerWebSouthEast',
        'cornerWebSouthWest',
        'sconceOpen',
      ],
      optional: true,
    },
    O3,
    0.1
  )

  fill(
    {
      region,
      domain: region.rect,
      variables: ['mushroom', 'dirtBoulder', 'stoneBoulder', 'randomItem'],
      optional: true,
    },
    O3,
    0.02
  )

  solve(
    {
      region,
      domain: region.rect,
      variables: [
        'batPack',
        'beholder',
        'gelCube',
        'goblinPackWeak',
        'goblinPackStrong',
        'ratPack',
        'skeletonPackWeak',
        'spiderPack',
      ],
      optional: true,
    },
    O3
  )

  O3.clearDebug()
  O3.finalize()
  return region
}

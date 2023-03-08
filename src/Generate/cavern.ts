import { CONFIG } from '../config'
import { Region } from '../Core'
import { logTimer } from '../lib/util'
import { cellularAutomata } from './modules'
import { fill, solve } from './modules/CSP/solve'
import { Overseer3 } from './Overseer3'

const scale = 2

export function cavern(
  isTopLevel: boolean,
  width = CONFIG.generateWidth * scale,
  height = CONFIG.generateHeight * scale
) {
  const region = new Region(width, height)
  region.name = 'cavern'

  const O3 = new Overseer3(region)
  O3.theme.wall = 'cavernWall'
  O3.theme.floor = 'stonePebbleFloor'

  const cellTimer = logTimer('cave gen')
  const cells = cellularAutomata(region.rect, {
    initialChance: 45,
    survival: 4,
    birth: 5,
    iterations: 4,
  })
  cellTimer.stop()

  cells.forEach(grid => {
    for (const [pt, state] of grid) {
      if (region.rect.isEdgePt(pt)) O3.wall(pt)
      else state ? O3.wall(pt) : O3.floor(pt)
    }
    O3.snap()
  })

  fill(
    {
      region,
      domain: region.rect,
      variables: [
        'cornerWebNorthEast',
        'cornerWebNorthWest',
        'cornerWebSouthEast',
        'cornerWebSouthWest',
      ],
      optional: true,
    },
    O3,
    0.1
  )

  solve(
    {
      region,
      domain: region.rect,
      variables: ['batPack', 'beholder', 'gelCube', 'goblinPackStrong', 'ratPack'],
      optional: true,
    },
    O3
  )

  O3.finalize()
  return region
}

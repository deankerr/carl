import { CONFIG } from '../config'
import { Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
import { logTimer, range } from '../lib/util'
import { Solver } from './modules/CSP/Solver'
import { Overseer3 } from './Overseer3'

export function tinyCrypt(
  isTopLevel: boolean,
  width = CONFIG.generateWidth,
  height = CONFIG.generateHeight
) {
  const region = new Region(width, height, 'tinyCrypt')
  const O3 = new Overseer3(region, 'crypt')
  O3.room(region.rect)
  O3.snap('Begin')

  // const room = Rect.atC(region.rect.center, 33, 15)
  const room = Rect.atC(region.rect.center, 20, 15)
  O3.room(room)
  const xStart = region.rect.center.add(-5, 0)
  for (const i of range(8)) {
    O3.wall(xStart.add(i, 1))
    O3.wall(region.rect.center.add(0, i))
  }
  O3.snap('a room')

  const CSP = new Solver(region, room, O3)
  const t = logTimer('Timer CSP')
  CSP.solve([
    // 'statueAltar',
    // 'cornerCandle',
    // 'bigDesk',
    // 'bookshelfEmpty',
    // 'bookshelf',
    // 'cornerWebNorthEast',
    // 'cornerWebNorthWest',
    // 'cornerWebSouthEast',
    // 'cornerWebSouthWest',
    'statueAltar',
    'smallDirtPitPlatformItem',
    'smallSludgePond',
    'smallWaterPond',
    'mushroom',

    'bigDesk',
    'statue',
    'goblinPackWeak',
    'goblinPackStrong',
    'skeletonPackWeak',
    'skeletonPackStrong',
    'spiderPack',
    'ratPack',
    'batPack',
    'beholder',
    'gelCube',
  ])
  t.stop()
  O3.finalize()
  // console.log(O3.history)
  return region
}

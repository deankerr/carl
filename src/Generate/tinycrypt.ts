import { CONFIG } from '../config'
import { Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
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

  const room = Rect.atC(region.rect.center, 6, 6)
  O3.room(room)
  O3.snap('a room')

  const CSP = new Solver(region, room, O3)
  CSP.solveOne('cornerCandle')

  O3.finalize()
  console.log(O3.history)
  return region
}

import { CONFIG } from '../config'
import { Region } from '../Core'
import { Rect } from '../lib/Shape/Rectangle'
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
  const room = Rect.atC(region.rect.center.add(-9, 0), 13, 10)
  const room2 = Rect.atC(region.rect.center.add(9, 0), 14, 11)
  O3.room(room)
  O3.room(room2)
  // const xStart = region.rect.center.add(-5, 0)
  // for (const i of range(8)) {
  //   O3.wall(xStart.add(i, 1))
  //   O3.wall(region.rect.center.add(0, i))
  // }
  // O3.snap('a room')

  O3.finalize()
  // console.log(O3.history)
  return region
}

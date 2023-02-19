import { CONFIG } from '../config'
import { Region } from '../Core'
import { Overseer3 } from './Overseer3'

export function gen5(
  isTopLevel: boolean,
  width = CONFIG.mainDisplayWidth,
  height = CONFIG.mainDisplayHeight
) {
  const region = new Region(width, height, 'gen5')
  const O3 = new Overseer3(region)
  O3.theme.wall = 'dungeonWall'
  O3.theme.floor = 'stoneTileFloor2'
  O3.theme.door = 'woodenDoor'
  O3.room(region.rect)

  // generator

  O3.finalize()
  return region
}

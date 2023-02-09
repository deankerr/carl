import { CONFIG } from '../config'
import { Region } from '../Core'
import { Overseer2 } from './Overseer2'

export function dungeon(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'dungeon'

  const wall = 'dungeonSolid'

  region.rect.edgePoints().forEach(pt => O2.terrain(pt, wall))

  O2.finalize()
  return region
}

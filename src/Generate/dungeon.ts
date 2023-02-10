import { CONFIG } from '../config'
import { Region } from '../Core'
import { Overseer2 } from './Overseer2'
import { floodFindRegions } from './modules/flood'
import { Point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'

export function dungeon(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'dungeon'

  const wall = 'dungeonWall'

  region.rect.edgePoints().forEach(pt => O2.terrain(pt, wall))

  const reg = floodFindRegions(region.rect, (pt: Point) => !region.terrainAt(pt).blocksMovement)

  O2.finalize()
  return region
}

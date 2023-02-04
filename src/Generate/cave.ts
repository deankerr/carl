/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from '../config'
import { Region } from '../Core'
import { repeat } from '../lib/util'
import { point } from '../Model/Point'
import { cellularInit, cellularLife } from './modules/cellular'
import { Overseer2 } from './Overseer2'

export function cave(width = CONFIG.mainDisplayWidth * 2, height = CONFIG.mainDisplayHeight * 2) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'cave'

  cellularInit(O2.module())

  repeat(5, i => cellularLife(O2.module(), i))

  // O2.being(point(0, 0), 'crab')
  // O2.snapshot('crab!')

  O2.finalize()
  return region
}

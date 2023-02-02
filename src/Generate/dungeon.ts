/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!! dev
import { CONFIG } from '../config'
import { Region } from '../Core'
import { logger } from '../lib/logger'

export function dungeon(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const log = logger('generate', 'dungeon')
  console.log('dungeon', width, height)

  const region = new Region(width, height, window.game.pool)
  return region
}

/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Terrain, Features, Beings } from '../Templates'
import { Overseer } from './Overseer'

export function dungeon(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const O = new Overseer(width, height)

  return O
}

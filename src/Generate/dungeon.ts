/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { max, rnd, rndO } from '../lib/util'
import { Pt } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { Terrain, Features, Beings } from '../Templates'
import { Overseer } from './Overseer'
import { Structure } from './structures/Structure'

const maxW = 11
const maxH = 11

export function dungeon(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const O = new Overseer(width, height)
  const level = new Structure(Rect.at(Pt(0, 0), width, height), O)
  level.mark(true)

  // initial rooms
  level.bisectDungeon(rnd(4, 6))
  level.innerRooms.forEach(r => {
    const room = r.inner(max(r.rect.width - 2, maxW), max(r.rect.height - 2, maxH))
    room.walls()
    if (room.rect.area > 90) {
      room.bisectRooms()
      room.buildInnerWalls()
      room.connectInnerRooms()
    }
  })

  // dig corridors

  return O
}

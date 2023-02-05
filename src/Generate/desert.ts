/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Entity, EntityKey, Region } from '../Core'
import { logger } from '../lib/logger'
import { half, pick, loop, rnd, repeat } from '../lib/util'
import { point, Point, neighbours4 } from '../Model/Point'
import { BeingKey } from '../Templates'
import { walk, hop } from './modules/drunkards'
import { Overseer2 } from './Overseer2'
// ? #bb6244 desert sunset

// ground '#e6ce80'
// unknown '#31261b'

export function desert(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const log = logger('generate', 'desert')

  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)
  // region.voidColor = '#bfa640'
  // region.voidColor = '#bb6244'
  // region.voidColor = '#e6ce80'
  // region.voidColorUnrevealed = '#31261b'
  region.name = 'Arid ZoneA'
  // region.voidColor = '#000'
  region.palette.ground = '#e6ce80'
  region.palette.unknown = '#31261b'

  const terrain = (type: EntityKey) => (pt: Point) => O2.terrain(pt, type)
  const being = (type: BeingKey) => (pt: Point) => O2.being(pt, type)
  const snap = (msg: string) => () => O2.snapshot(msg)

  const center = point(half(width), half(height))

  repeat(2, () => {
    walk(24, 200, rndPt, terrain('deadGrass'), snap('dead grass'))
    hop(10, 10, 5, rndPt, terrain('grass'), snap('grass'))
    hop(6, 4, 12, rndPt, terrain('shrub'), snap('shrubs'))
    hop(8, 8, 8, rndPt, terrain('mound'), snap('mounds'))
    hop(6, 4, 12, rndPt, terrain('deadTree'), snap('dead trees'))
    hop(8, 10, 8, rndPt, terrain('cactus'), snap('cacti'))
  })

  repeat(1, () => {
    hop(8, 4, 4, rndPt, being('snake'), snap('snakes'))
    hop(8, 4, 4, rndPt, being('bloodGull'), snap('gulls'))
    hop(8, 4, 4, rndPt, being('spider'), snap('spiders'))
    hop(8, 4, 4, rndPt, being('warboy'), snap('warboys'))
    hop(8, 4, 4, rndPt, being('scorpion'), snap('scorpions'))
  })

  O2.finalize()
  console.log('O2:', O2)
  log.end()
  return region

  function rndPt() {
    return point(rnd(0, width), rnd(0, height))
  }
}

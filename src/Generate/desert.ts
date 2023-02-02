/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { logger } from '../lib/logger'
import { half, pick, loop, rnd } from '../lib/util'
import { point, Point, neighbours4 } from '../Model/Point'
import { walk, hop } from './modules/drunkards'
import { Overseer2 } from './Overseer2'
// ? #bb6244 desert sunset

export function desert(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const log = logger('generate', 'desert')

  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)
  region.voidColor = '#bba344'
  // region.voidColor = '#000'

  const center = point(half(width), half(height))

  // dead grass
  walk(
    12,
    200,
    rndPt,
    pt => O2.terrain(pt, 'deadGrass'),
    () => O2.snapshot('deadGrass')
  )

  // grass
  hop(
    10,
    10,
    5,
    rndPt,
    pt => O2.terrain(pt, 'grass'),
    () => O2.snapshot('grass')
  )

  // mound
  hop(
    8,
    8,
    8,
    rndPt,
    pt => O2.terrain(pt, 'mound'),
    () => O2.snapshot('mound')
  )

  // dead Tree
  hop(
    8,
    10,
    8,
    rndPt,
    pt => O2.feature(pt, 'deadTree'),
    () => O2.snapshot('deadTree')
  )

  // cactus
  hop(
    8,
    10,
    8,
    rndPt,
    pt => O2.feature(pt, 'cactus'),
    () => O2.snapshot('cactus')
  )

  // snakes!
  hop(
    8,
    4,
    4,
    rndPt,
    pt => O2.being(pt, 'snake'),
    () => O2.snapshot('snake')
  )

  O2.finalize()
  console.log('O2:', O2)
  log.end()
  return region

  function rndPt() {
    return point(rnd(0, width), rnd(0, height))
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { logger } from '../lib/logger'
import { half, pick, loop, rnd, repeat } from '../lib/util'
import { point, Point, neighbours4 } from '../Model/Point'
import { walk, hop } from './modules/drunkards'
import { Overseer2 } from './Overseer2'
// ? #bb6244 desert sunset

export function desert(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const log = logger('generate', 'desert')

  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)
  // region.voidColor = '#bfa640'
  // region.voidColor = '#bb6244'
  region.voidColor = '#e6ce80'
  region.voidColorUnrevealed = '#393013'
  // region.voidColor = '#000'

  const center = point(half(width), half(height))

  repeat(2, () => {
    // dead grass
    const deadGrass = (pt: Point) => O2.terrain(pt, 'deadGrass')
    walk(24, 200, rndPt, deadGrass)

    // grass
    const grass = (pt: Point) => O2.terrain(pt, 'grass')
    hop(10, 10, 5, rndPt, grass)

    // shrub
    const shrub = (pt: Point) => O2.terrain(pt, 'shrub')
    hop(6, 4, 12, rndPt, shrub)

    // mound
    const mound = (pt: Point) => O2.terrain(pt, 'mound')
    hop(8, 8, 8, rndPt, mound)

    // dead Tree
    const deadTree = (pt: Point) => O2.terrain(pt, 'deadTree')
    hop(6, 4, 12, rndPt, deadTree)

    // cactus
    const cactus = (pt: Point) => O2.terrain(pt, 'cactus')
    hop(8, 10, 8, rndPt, cactus)
  })

  const snakes = (pt: Point) => O2.being(pt, 'snake')
  const gulls = (pt: Point) => O2.being(pt, 'bloodGull')
  const spiders = (pt: Point) => O2.being(pt, 'spider')
  const tick = (pt: Point) => O2.being(pt, 'tick')
  const scorpion = (pt: Point) => O2.being(pt, 'scorpion')

  hop(8, 4, 4, rndPt, snakes)
  hop(8, 4, 4, rndPt, gulls)
  hop(8, 4, 4, rndPt, spiders)
  hop(8, 4, 4, rndPt, tick)
  hop(8, 4, 4, rndPt, scorpion)

  O2.finalize()
  console.log('O2:', O2)
  log.end()
  return region

  function rndPt() {
    return point(rnd(0, width), rnd(0, height))
  }
}
